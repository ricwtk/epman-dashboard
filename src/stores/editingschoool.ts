import { ref, toRaw, computed } from 'vue';
import type { School } from "@/types/school";
import type { ProgrammeToSchoolMap } from "@/services/dataService";

import { createNewSchool } from "@/utils/schoolHelpers";
import { defineStore } from "pinia";
import { get, set } from 'lodash-es';
import diff from 'microdiff';
import { formatRevision, formatId } from '@/utils/common';
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();
import { dataService } from '@/services/dataService';

export const useEditingSchoolStore = defineStore('editing-school', () => {
  const school = ref<School>(structuredClone(createNewSchool()))
  const originalSchool = ref<School>(structuredClone(createNewSchool()))
  const selectedTab = ref<string>('summary')
  const updated = ref(false)
  const programmeToSchoolMap = ref<ProgrammeToSchoolMap>({})
  const addedProgrammes = computed(() => {
    return school.value.programmes.filter(p => !originalSchool.value.programmes.includes(p))
  })
  const removedProgrammes = computed(() => {
    return originalSchool.value.programmes.filter(p => !school.value.programmes.includes(p))
  })

  async function updateProgrammeToSchoolMap(): Promise<void> {
    programmeToSchoolMap.value = await dataService.getProgrammeToSchoolMap()
  }
  updateProgrammeToSchoolMap();

  function resetSchool(): void {
    school.value = structuredClone(toRaw(originalSchool.value))
  }

  function commitSchool(): void {
    originalSchool.value = structuredClone(toRaw(school.value));
    updateProgrammeToSchoolMap();
  }

  function getDiff(pathArray: string[]): any {
    const original = get(originalSchool.value, pathArray)
    const current = get(school.value, pathArray)
    return diff(original, current)
  }

  function resetDiff(pathArray: string[]): void {
    const original = get(originalSchool.value, pathArray)
    set(school.value, pathArray, original)
  }

  function checkDiff(pathArray: string[]): boolean {
    if (!pathArray.length)
      return diff(school.value, originalSchool.value).length > 0;

    const original = get(originalSchool.value, pathArray);
    const current = get(school.value, pathArray);

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

  function loadSchool(sch: School): void {
    originalSchool.value = structuredClone(sch)
    school.value = structuredClone(sch)
  }

  async function saveSchool(): Promise<void> {
    school.value.parentRevision = school.value.revision
    school.value.revision = formatRevision()
    school.value.committed = {
      on: new Date(),
      by: authStore.user?.email || 'unknown'
    }
    school.value.id = formatId(school.value);
    try {
      await dataService.saveSchool(school.value);
      commitSchool();
      updated.value = true;
    } catch (error) {
      console.error('Error saving school:', error);
    }
  }

  return {
    selectedTab, school,
    addedProgrammes, removedProgrammes,
    resetSchool, commitSchool, loadSchool, saveSchool,
    programmeToSchoolMap, updateProgrammeToSchoolMap,
    getDiff, checkDiff, resetDiff, updated
  }
})
