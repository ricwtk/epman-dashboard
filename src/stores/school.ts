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
import { navigateToParent } from "@/utils/navigationHelpers";

export const useSchoolStore = defineStore('school', () => {
  const draft = ref<School>(structuredClone(createNewSchool()))
  const saved = ref<School>(structuredClone(createNewSchool()))
  const revisions = ref<School[]>([])
  const loading_flags = ref<{ [key: string]: boolean }>({})
  const loading = computed(() => Object.values(loading_flags.value).some(flag => flag))

  async function loadSchoolByCode(code: string) {
    loading_flags.value[loadSchoolByCode.name] = true;
    clear();
    revisions.value = await dataService.getSchool(code);
    revisions.value.sort((a, b) => b.revision.localeCompare(a.revision));
    if (revisions.value.length > 0) {
      saved.value = revisions.value[0]!;
    }
    loading_flags.value[loadSchoolByCode.name] = false;
  }
  function loadRevision(revision: string) {
    loading_flags.value[loadRevision.name] = true;
    clear();
    const revIndex = revisions.value.findIndex(sch => sch.revision === revision);
    if (revIndex !== -1) {
      saved.value = revisions.value[revIndex]!;
    }
    loading_flags.value[loadRevision.name] = false;
  }
  async function deleteRevision() {
    loading_flags.value[deleteRevision.name] = true;
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
    loading_flags.value[deleteRevision.name] = false;
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
    loading_flags.value[updateProgrammeToSchoolMap.name] = true;
    programmeToSchoolMap.value = await dataService.getProgrammeToSchoolMap()
    loading_flags.value[updateProgrammeToSchoolMap.name] = false;
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
    loading_flags.value[resetDiff.name] = true;
    const original = get(saved.value, pathArray)
    set(draft.value, pathArray, original)
    loading_flags.value[resetDiff.name] = false;
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

  async function save(): Promise<void> {
    loading_flags.value[save.name] = true;
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
      addToRevisions();
    } catch (error) {
      console.error('Error saving school:', error);
    }
    loading_flags.value[save.name] = false;
  }

  function addToRevisions(): void {
    revisions.value.splice(0, 0, toRaw(draft.value))
  }

  return {
    loading, loading_flags,
    draft, saved, revisions,
    editingTab,
    loadSchoolByCode, loadRevision, deleteRevision,
    addedProgrammes, removedProgrammes,
    clear, createDraft, resetDraft,
    commit, save,
    programmeToSchoolMap, updateProgrammeToSchoolMap,
    getDiff, checkDiff, resetDiff
  }
})
