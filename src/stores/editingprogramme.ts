import { ref, type Ref, toRaw } from 'vue';
import type { Programme } from "@/types/programme";
import { createNewProgramme } from "@/utils/programmeHelpers";
import { defineStore } from "pinia";
import { get, set } from 'lodash';
import diff from 'microdiff';

export const useEditingProgrammeStore = defineStore('editing-programme', () => {
  const programme: Ref<Programme> = ref(createNewProgramme())
  const originalProgramme: Ref<Programme> = ref(createNewProgramme())

  function resetProgramme(): void {
    programme.value = structuredClone(toRaw(originalProgramme.value))
  }

  function resetDiff(pathArray: string[]): void {
    const original = get(originalProgramme.value, pathArray)
    set(programme.value, pathArray, original)
  }

  function checkDiff(pathArray: string[]): boolean {
    if (!pathArray.length)
      return diff(programme.value, originalProgramme.value).length > 0;
    const original = get(originalProgramme.value, pathArray)
    const current = get(programme.value, pathArray)
    if (original && current) {
      return diff(original, current).length > 0 || original.length !== current.length;
    } else return true;
  }

  function loadProgramme(prog: Programme): void {
    originalProgramme.value = structuredClone(prog)
    programme.value = structuredClone(prog)
  }

  return { programme, resetProgramme, loadProgramme, checkDiff, resetDiff }
})
