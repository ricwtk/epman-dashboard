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

export const useEditingStructureStore = defineStore('editing-structure', () => {
  const structure: Ref<ProgrammeStructure> = ref(createNewStructure())
  const originalStructure: Ref<ProgrammeStructure> = ref(createNewStructure())

  function resetStructure(): void {
    structure.value = structuredClone(toRaw(originalStructure.value))
  }

  function resetDiff(): void {
    resetStructure()
  }

  function checkDiff(): boolean {
    return getDiff().length > 0;
  }

  function getDiff() {
    console.log(structure.value)
    console.log(originalStructure.value)
    return diff(originalStructure.value, structure.value)
    // return diff(structure.value, originalStructure.value)
  }

  function loadStructure(prog: string, label: string): void {
    const progstruct = getStructureByProgrammeAndLabel(prog, label) || createNewStructure()
    originalStructure.value = structuredClone(progstruct)
    structure.value = structuredClone(progstruct)
  }

  return { structure, originalStructure, resetStructure, resetDiff, checkDiff, getDiff, loadStructure }
})
