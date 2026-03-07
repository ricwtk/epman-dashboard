import { ref, toRaw, computed } from 'vue';
import { computedAsync } from '@vueuse/core';

import type { School } from "@/types/school";
import type { Programme } from "@/types/programme";
import type { ProgrammeToSchoolMap } from "@/services/dataService";

import { createNewSchool } from "@/utils/schoolHelpers";
import { defineStore } from "pinia";
import { get, set } from 'lodash-es';
import diff from 'microdiff';
import { formatRevision, formatId } from '@/utils/common';
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();
import { dataService } from '@/services/dataService';
import { navigateToParent } from "@/utils/navigationHelpers";

export const useSchoolStore = defineStore('school', () => {
  const draft = ref<School>(structuredClone(createNewSchool()))
  const saved = ref<School>(structuredClone(createNewSchool()))
  const revisions = ref<School[]>([])

  async function loadSchoolByCode(code: string) {
    clear();
    revisions.value = await dataService.getSchool(code);
    revisions.value.sort((a, b) => b.revision.localeCompare(a.revision));
    if (revisions.value.length > 0) {
      saved.value = revisions.value[0]!;
    }
  }
  function loadRevision(revision: string) {
    clear();
    const revIndex = revisions.value.findIndex(sch => sch.revision === revision);
    if (revIndex !== -1) {
      saved.value = revisions.value[revIndex]!;
    }
  }
  async function deleteRevision() {
    if (saved.value.id !== "") {
      await dataService.deleteItem('schools', saved.value.id);
      const revIndex = revisions.value.findIndex(sch => sch.id === saved.value.id)
      revisions.value.splice(revIndex, 1);
      if (revIndex < revisions.value.length) {
        saved.value = revisions.value[revIndex]!;
      } else if (revisions.value.length > 0) {
        saved.value = revisions.value[revisions.value.length - 1]!;
      } else {
        clear();
        navigateToParent();
      }
    }
  }

  const editingTab = ref<string>('summary')

  const programmeToSchoolMap = ref<ProgrammeToSchoolMap>({})
  const addedProgrammes = computed(() => {
    return draft.value.programmes.filter(p => !saved.value.programmes.includes(p))
  })
  const removedProgrammes = computed(() => {
    return saved.value.programmes.filter(p => !draft.value.programmes.includes(p))
  })

  async function updateProgrammeToSchoolMap(): Promise<void> {
    programmeToSchoolMap.value = await dataService.getProgrammeToSchoolMap()
  }
  updateProgrammeToSchoolMap();

  function clear(): void { draft.value = structuredClone(createNewSchool()); saved.value = structuredClone(createNewSchool()) }
  function createDraft(): void { draft.value = structuredClone(toRaw(saved.value)); }
  function resetDraft(): void { draft.value = structuredClone(toRaw(saved.value)); }
  function commit(): void {
    saved.value = structuredClone(toRaw(draft.value));
    updateProgrammeToSchoolMap();
  }

  function getDiff(pathArray: string[]): any {
    const original = get(saved.value, pathArray)
    const current = get(draft.value, pathArray)
    return diff(original, current)
  }

  function resetDiff(pathArray: string[]): void {
    const original = get(saved.value, pathArray)
    set(draft.value, pathArray, original)
  }

  function checkDiff(pathArray: string[]): boolean {
    if (!pathArray.length)
      return diff(draft.value, saved.value).length > 0;

    const original = get(saved.value, pathArray);
    const current = get(draft.value, pathArray);

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
    saved.value = structuredClone(sch)
    draft.value = structuredClone(sch)
  }

  async function save(): Promise<void> {
    draft.value.parentRevision = draft.value.revision
    draft.value.revision = formatRevision()
    draft.value.committed = {
      on: new Date(),
      by: authStore.user?.email || 'unknown'
    }
    draft.value.id = formatId(draft.value);
    try {
      await dataService.saveSchool(draft.value);
      commit();
    } catch (error) {
      console.error('Error saving school:', error);
    }
  }

  return {
    draft, saved, revisions,
    editingTab,
    loadSchoolByCode, loadRevision, deleteRevision,
    addedProgrammes, removedProgrammes,
    clear, createDraft, resetDraft,
    commit, loadSchool, save,
    programmeToSchoolMap, updateProgrammeToSchoolMap,
    getDiff, checkDiff, resetDiff
  }
})
