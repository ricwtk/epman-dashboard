import { ref, type Ref, toRaw, computed } from 'vue';
import { computedAsync } from '@vueuse/core';
import type { Programme, ProgrammeStructure } from "@/types/programme";
import { createNewProgramme } from "@/utils/programmeHelpers";
import { defineStore } from "pinia";
import { get, set, has, unset } from 'lodash-es';
import diff from 'microdiff';
import { formatRevision, formatId } from '@/utils/common';
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();
import { dataService, type GroupedStructures } from '@/services/dataService';

import { getStructureLabelsByProgramme } from '@/utils/structureHelpers';

export const useEditingProgrammeStore = defineStore('editing-programme', () => {
  const programme: Ref<Programme> = ref(createNewProgramme())
  const originalProgramme: Ref<Programme> = ref(createNewProgramme())
  const selectedTab = ref<string>('summary')
  const updated = ref(false)
  const structureTrigger = ref(0)
  // const allDiff = computed(() => {
  //   return diff(originalProgramme.value, programme.value);
  // })

  const structures: Ref<GroupedStructures | undefined> = computedAsync(async () => {
    // return getStructureLabelsByProgramme(programme.value.code);
    structureTrigger.value
    return await dataService.getStructuresByProgramme(programme.value.code);
  })

  const school = computedAsync(async () => {
    return await dataService.getSchoolByProgrammeCode(programme.value.code);
  });

  function resetProgramme(): void {
    programme.value = structuredClone(toRaw(originalProgramme.value))
  }

  function commitProgramme(): void {
    originalProgramme.value = structuredClone(toRaw(programme.value));
  }

  function resetDiff(pathArray: string[]): void {
    const existsInOriginal = has(originalProgramme.value, pathArray);
    if (!existsInOriginal) {
      const parentPath = pathArray.slice(0, -1);
      const key = pathArray[pathArray.length - 1];

      const parent = get(programme.value, parentPath);

      if (key) {
        if (Array.isArray(parent) && !isNaN(Number(key))) {
          parent.splice(Number(key), 1);
        } else {
          delete parent[key];
        }
      }

      return;
    }
    // Field exists → reset to original value
    const original = get(originalProgramme.value, pathArray);
    set(programme.value, pathArray, original);
  }

  function checkDiff(pathArray: string[]): boolean {
    if (!pathArray.length)
      return diff(programme.value, originalProgramme.value).length > 0;

    const original = get(originalProgramme.value, pathArray);
    const current = get(programme.value, pathArray);

    // If both are arrays
    if (Array.isArray(original) && Array.isArray(current)) {
      return (
        diff(original, current).length > 0 ||
        original.length !== current.length
      );
    }

    // If both are objects
    if (
      original !== null &&
      current !== null &&
      typeof original === 'object' &&
      typeof current === 'object'
    ) {
      return diff(original, current).length > 0;
    }

    // Primitive comparison (string, number, boolean, null, undefined)
    return original !== current;
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

  async function saveProgramme(): Promise<void> {
    programme.value.parentRevision = programme.value.revision
    programme.value.revision = formatRevision()
    programme.value.committed = {
      on: new Date(),
      by: authStore.user?.email || 'unknown'
    }
    programme.value.id = formatId(programme.value);
    try {
      await dataService.saveProgramme(programme.value);
      commitProgramme();
      updated.value = true;
    } catch (error) {
      console.error('Error saving programme:', error);
    }
  }

  async function deleteStructure(structToDelete: ProgrammeStructure) {
    const structureId = structToDelete.id;
    const structureLabel = structToDelete.label;
    await dataService.deleteItem("structures", structureId);
    let indexToDelete = structures.value![structureLabel]!.findIndex(x => x.id === structureId);
    if (indexToDelete !== -1) {
      structures.value![structureLabel]!.splice(indexToDelete, 1);
    }
    let updatedStructureLabel = null
    let updatedRevision = null
    if (structures.value![structureLabel]!.length === 0) {
      delete structures.value![structureLabel];
    } else {
      updatedStructureLabel = structureLabel
      if (indexToDelete !== -1) {
        if (indexToDelete >= structures.value![structureLabel]!.length) {
          indexToDelete = indexToDelete -1
        }
        updatedRevision = structures.value![structureLabel]![indexToDelete]!.revision
      }
    }
    return { updatedStructureLabel, updatedRevision }
  }

  return {
    selectedTab,
    school,
    programme,
    structures,
    resetProgramme,
    loadProgramme,
    // allDiff,
    checkDiff,
    resetDiff,
    checkMappingDiff,
    resetMappingDiff,
    updated,
    commitProgramme,
    saveProgramme,
    deleteStructure,
    structureTrigger
  }
})
