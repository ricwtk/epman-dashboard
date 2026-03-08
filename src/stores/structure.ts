import { ref, watch, toRaw, computed } from 'vue';
import type { ProgrammeStructure } from "@/types/programme";
import { createNewStructure } from "@/utils/structureHelpers";
import { defineStore } from "pinia";
import diff from 'microdiff';
import { dataService } from '@/services/dataService';
import { formatRevision, formatStructureId } from '@/utils/common';

import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();

export const useStructureStore = defineStore('structure', () => {
  const programmeCode = ref<string>("")
  const structureRevisions = ref<{ [revision: string]: ProgrammeStructure }>({})
  const revisions = computed<string[]>(() => Object.keys(structureRevisions.value).sort((a, b) => b.localeCompare(a)))

  const selectedStructureLabel = ref<string>("")
  const draft = ref<ProgrammeStructure>(createNewStructure())
  const saved = ref<ProgrammeStructure>(createNewStructure())

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
      saved.value = structureRevisions.value[selectedRevision.value]!
      draft.value = structuredClone(toRaw(saved.value))
    }
  }

  function clear(): void { saved.value = createNewStructure(); draft.value = createNewStructure() }
  function resetDraft(): void { draft.value = structuredClone(toRaw(saved.value)) }
  function commit(): void { saved.value = structuredClone(toRaw(draft.value)) }

  function resetDiff(): void { resetDraft() }

  function checkDiff(): boolean { return getDiff().length > 0; }

  function getDiff() { return diff(saved.value, draft.value) }

  function copyStructureFrom(struc: ProgrammeStructure): void {
    saved.value = structuredClone(toRaw(struc))
    draft.value = structuredClone(toRaw(struc))
    selectedStructureLabel.value = struc.label
    selectedRevision.value = struc.revision
    structureRevisions.value[struc.revision] = structuredClone(toRaw(struc))
  }

  async function save(): Promise<void> {
    draft.value.parentRevision = draft.value.revision
    draft.value.revision = formatRevision()
    draft.value.committed = {
      on: new Date(),
      by: authStore.user?.email || 'unknown'
    }
    draft.value.id = formatStructureId(draft.value)
    commit()
  }

  async function deleteRevision() {
    if (draft.value.id !== "") {
      const idToDelete = draft.value.id
      await dataService.deleteItem("structures", idToDelete)

      const revIndex = revisions.value.indexOf(selectedRevision.value)
      if (revisions.value.includes(selectedRevision.value)) {
        delete structureRevisions.value[selectedRevision.value]
      }
      if (revisions.value.length == 0) {
        selectedRevision.value = ""
        selectedStructureLabel.value = ""
      } else if (revisions.value.length > revIndex) {
        selectedRevision.value = revisions.value[revIndex]!
      } else {
        selectedRevision.value = revisions.value[revIndex - 1]!
      }
    }
  }

  return {
    programmeCode,
    draft, saved,
    selectedStructureLabel,
    structureRevisions,
    revisions, selectedRevision, deleteRevision,
    resetDraft, clear,
    resetDiff, checkDiff, getDiff,
    loadStructure, copyStructureFrom,
    save, commit
  }
})
