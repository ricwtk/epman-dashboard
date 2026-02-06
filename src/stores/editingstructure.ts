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

  const structureWithCourseInfo = computed(() => {
    if (!structure.value.label) { return [] }
    return getCourseInfoInStructure(structure.value.structure)
  })

  const structureBySemesters = computed(() => {
    if (!structure.value.label) { return convertStructureToTable() }
    return convertStructureToTable(structureWithCourseInfo.value)
  })

  function resetStructure(): void {
    structure.value = structuredClone(toRaw(originalStructure.value))
  }

  function resetDiff(pathArray: string[]): void {
    const original = get(originalStructure.value, pathArray)
    set(structure.value, pathArray, original)
  }

  function checkDiff(pathArray: string[]): boolean {
    if (!pathArray.length)
      return diff(structure.value, originalStructure.value).length > 0;
    const original = get(originalStructure.value, pathArray)
    const current = get(structure.value, pathArray)
    if (original && current) {
      return diff(original, current).length > 0 || original.length !== current.length;
    } else return true;
  }

  function loadStructure(prog: string, label: string): void {
    const progstruct = getStructureByProgrammeAndLabel(prog, label) || createNewStructure()
    originalStructure.value = structuredClone(progstruct)
    structure.value = structuredClone(progstruct)
  }

  return { structure, originalStructure, structureWithCourseInfo, structureBySemesters, resetStructure, resetDiff, checkDiff, loadStructure }
})
