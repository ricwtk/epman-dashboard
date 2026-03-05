import { ref, watch, toRaw, computed } from 'vue';
import type { ProgrammeStructure } from "@/types/programme";
import {
  createNewStructure,
  getCourseInfoInStructure,
  getStructureByProgrammeAndLabel,
  convertStructureToTable
} from "@/utils/structureHelpers";
import { defineStore } from "pinia";
import { get, set } from 'lodash-es';
import diff from 'microdiff';
import { dataService } from '@/services/dataService';
import { formatRevision, formatStructureId } from '@/utils/common';

import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();

export const useEditingStructureStore = defineStore('editing-structure', () => {
  const programmeCode = ref<string>("")
  const structureRevisions = ref<{ [revision: string]: ProgrammeStructure }>({})
  const revisions = computed<string[]>(() => Object.keys(structureRevisions.value).sort((a, b) => b.localeCompare(a)))

  const selectedStructureLabel = ref<string>("")
  const structure = ref<ProgrammeStructure>(createNewStructure())
  const originalStructure = ref<ProgrammeStructure>(createNewStructure())

  async function loadStructureRevisionsByProgrammeAndLabel(programme: string, label: string) {
    structureRevisions.value = await dataService.getStructureRevisionsByProgrammeAndLabel(programme, label)
  }
  watch([programmeCode, selectedStructureLabel], () => {
    if (programmeCode.value && selectedStructureLabel.value) {
      loadStructureRevisionsByProgrammeAndLabel(
        programmeCode.value,
        selectedStructureLabel.value
      )
    }
  })

  const selectedRevision = ref<string>("")
  watch(structureRevisions, () => {
    if (revisions.value.length < 1) { selectedRevision.value = "" }
    else if (
      !selectedRevision.value
      || !revisions.value.includes(selectedRevision.value)
    ) { selectedRevision.value = revisions.value[0] || "" }
    else { loadStructure(); }
  })
  watch(selectedRevision, () => loadStructure())
  function loadStructure() {
    if (revisions.value.includes(selectedRevision.value)) {
      originalStructure.value = structureRevisions.value[selectedRevision.value]!
      structure.value = structuredClone(toRaw(originalStructure.value))
    }
  }

  function resetStructure(): void {
    structure.value = structuredClone(toRaw(originalStructure.value))
  }

  function commitStructure(): void {
    originalStructure.value = structuredClone(toRaw(structure.value))
  }

  function resetDiff(): void {
    resetStructure()
  }

  function checkDiff(): boolean {
    return getDiff().length > 0;
  }

  function getDiff() {
    return diff(originalStructure.value, structure.value)
    // return diff(structure.value, originalStructure.value)
  }

  function copyStructureFrom(struc: ProgrammeStructure): void {
    originalStructure.value = structuredClone(toRaw(struc))
    structure.value = structuredClone(toRaw(struc))
    selectedStructureLabel.value = struc.label
    selectedRevision.value = struc.revision
    structureRevisions.value[struc.revision] = structuredClone(toRaw(struc))
  }

  async function saveStructure(): Promise<void> {
    structure.value.parentRevision = structure.value.revision
    structure.value.revision = formatRevision()
    structure.value.committed = {
      on: new Date(),
      by: authStore.user?.email || 'unknown'
    }
    structure.value.id = formatStructureId(structure.value)
    commitStructure()
  }

  function deleteRevision() {
    const indexToDelete = revisions.value.indexOf(selectedRevision.value)
    if (revisions.value.includes(selectedRevision.value)) {
      delete structureRevisions.value[selectedRevision.value]
    }
    if (revisions.value.length == 0) {
      selectedRevision.value = ""
      selectedStructureLabel.value = ""
    } else if (revisions.value.length > indexToDelete) {
      selectedRevision.value = revisions.value[indexToDelete]!
    } else {
      selectedRevision.value = revisions.value[indexToDelete - 1]!
    }
  }

  return {
    programmeCode,
    structure,
    originalStructure,
    selectedStructureLabel,
    structureRevisions,
    revisions, selectedRevision, deleteRevision,
    resetStructure,
    resetDiff, checkDiff, getDiff,
    loadStructure, copyStructureFrom,
    saveStructure, commitStructure
  }
})
