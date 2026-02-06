import { ref, type Ref, toRaw, computed } from 'vue';
import type { Programme } from "@/types/programme";
import { createNewProgramme } from "@/utils/programmeHelpers";
import { defineStore } from "pinia";
import { get, set } from 'lodash-es';
import diff from 'microdiff';
import { getSchoolByProgrammeCode } from "@/utils/schoolHelpers";
import { getStructureLabelsByProgramme } from '@/utils/structureHelpers';

export const useEditingProgrammeStore = defineStore('editing-programme', () => {
  const programme: Ref<Programme> = ref(createNewProgramme())
  const originalProgramme: Ref<Programme> = ref(createNewProgramme())

  const structureLabels = computed(() => {
    return getStructureLabelsByProgramme(programme.value.code);
  })

  const school = computed(() => {
    return getSchoolByProgrammeCode(programme.value.code);
  });

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

  function checkMappingDiff(coursetype: "examBased" | "projectBased", component: "wk" | "wp" | "ea"): boolean {
    const originalPoList = originalProgramme.value.poList
    const original = originalPoList.map(po => get(po, ['mapping', coursetype, component]))

    const currentPoList = programme.value.poList
    const current = currentPoList.map(po => get(po, ['mapping', coursetype, component]))

    if (original && current) {
      return diff(original, current).length > 0 || original.length !== current.length;
    } else return true;
  }

  function resetMappingDiff(coursetype: "examBased" | "projectBased", component: "wk" | "wp" | "ea"): void {
    const originalPoList = originalProgramme.value.poList
    const original = originalPoList.map(po => get(po, ['mapping', coursetype, component]))

    const currentPoList = programme.value.poList
    const current = currentPoList.map(po => get(po, ['mapping', coursetype, component]))

    if (original && current) {
      currentPoList.map((po, index) => set(po, ['mapping', coursetype, component], structuredClone(toRaw(original[index]))))
    }
  }

  function loadProgramme(prog: Programme): void {
    originalProgramme.value = structuredClone(prog)
    programme.value = structuredClone(prog)
  }

  return { school, programme, structureLabels, resetProgramme, loadProgramme, checkDiff, resetDiff, checkMappingDiff, resetMappingDiff }
})
