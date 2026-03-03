import { ref, type Ref, toRaw, computed } from 'vue';
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
import { formatRevision } from '@/utils/common';
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();

export const useEditingStructureStore = defineStore('editing-structure', () => {
  const structure: Ref<ProgrammeStructure> = ref(createNewStructure())
  const originalStructure: Ref<ProgrammeStructure> = ref(createNewStructure())

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

  function loadStructure(prog: string, label: string): void {
    const progstruct = getStructureByProgrammeAndLabel(prog, label) || createNewStructure()
    originalStructure.value = structuredClone(progstruct)
    structure.value = structuredClone(progstruct)
  }

  function copyStructureFrom(struc: ProgrammeStructure): void {
    originalStructure.value = structuredClone(toRaw(struc))
    structure.value = structuredClone(toRaw(struc))
  }

  async function saveStructure(): Promise<void> {
    structure.value.parentRevision = structure.value.revision
    structure.value.revision = formatRevision()
    structure.value.committed = {
      on: new Date(),
      by: authStore.user?.email || 'unknown'
    }
    await dataService.saveStructure(structure.value)

  }

  return {
    structure,
    originalStructure,
    resetStructure,
    resetDiff, checkDiff, getDiff,
    loadStructure, copyStructureFrom,
    saveStructure, commitStructure
  }
})
