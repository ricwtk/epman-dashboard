import { ref, toRaw, computed } from 'vue';
import { computedAsync } from '@vueuse/core';
import type { Programme } from "@/types/programme";
import { createNewProgramme } from "@/utils/programmeHelpers";
import { defineStore } from "pinia";
import { get, set, has } from 'lodash-es';
import diff from 'microdiff';
import { formatRevision, formatId } from '@/utils/common';
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();
import { dataService } from '@/services/dataService';
import type { CourseType } from '@/types/course';
import { navigateToParent } from "@/utils/navigationHelpers";

export const useProgrammeStore = defineStore('programme', () => {
  const draft= ref<Programme>(createNewProgramme())
  const saved = ref<Programme>(createNewProgramme())
  const revisions = ref<Programme[]>([])

  const editingTab = ref<string>('summary')


  // const allDiff = computed(() => {
  //   return diff(saved.value, draft.value);
  // })

  async function loadProgrammeByCode(code: string) {
    clear();
    revisions.value = await dataService.getProgramme(code);
    revisions.value.sort((a, b) => b.revision.localeCompare(a.revision));
    if (revisions.value.length > 0) {
      saved.value = revisions.value[0]!;
    }
  }

  function loadRevision(revision: string) {
    clear();
    const revIndex = revisions.value.findIndex(prog => prog.revision === revision);
    if (revIndex !== -1) {
      saved.value = revisions.value[revIndex]!;
    }
  }

  async function deleteRevision() {
    if (saved.value.id !== "") {
      await dataService.deleteItem('programmes', saved.value.id);
      const revIndex = revisions.value.findIndex(prog => prog.id === saved.value.id)
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

  const school = computedAsync(async () => {
    return await dataService.getSchoolByProgrammeCode(draft.value.code);
  });

  function clear(): void { draft.value = createNewProgramme(); saved.value = createNewProgramme(); }
  function resetDraft(): void { draft.value = structuredClone(toRaw(saved.value)) }
  function createDraft(): void { draft.value = structuredClone(toRaw(saved.value)) }
  function commit(): void { saved.value = structuredClone(toRaw(draft.value)); }

  function resetDiff(pathArray: string[]): void {
    const existsInOriginal = has(saved.value, pathArray);
    if (!existsInOriginal) {
      const parentPath = pathArray.slice(0, -1);
      const key = pathArray[pathArray.length - 1];

      const parent = get(draft.value, parentPath);

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
    const original = get(saved.value, pathArray);
    set(draft.value, pathArray, original);
  }

  function checkDiff(pathArray: string[]): boolean {
    if (!pathArray.length)
      return diff(draft.value, saved.value).length > 0;

    const original = get(saved.value, pathArray);
    const current = get(draft.value, pathArray);

    if (Array.isArray(original) && Array.isArray(current)) { // array check
      return (
        diff(original, current).length > 0 ||
        original.length !== current.length
      );
    }

    if ( // object check
      original !== null &&
      current !== null &&
      typeof original === 'object' &&
      typeof current === 'object'
    ) {
      return diff(original, current).length > 0;
    }

    return original !== current; // Primitive comparison (string, number, boolean, null, undefined)
  }

  function checkMappingDiff(courseType: CourseType, component: "wk" | "wp" | "ea"): boolean {
    const originalPoList = saved.value.poList
    const original = originalPoList.map(po => get(po, ['mapping', courseType, component]))

    const currentPoList = draft.value.poList
    const current = currentPoList.map(po => get(po, ['mapping', courseType, component]))

    if (original && current) {
      return diff(original, current).length > 0 || original.length !== current.length;
    } else return true;
  }

  function resetMappingDiff(courseType: CourseType, component: "wk" | "wp" | "ea"): void {
    const originalPoList = saved.value.poList
    const original = originalPoList.map(po => get(po, ['mapping', courseType, component]))

    const currentPoList = draft.value.poList
    const current = currentPoList.map(po => get(po, ['mapping', courseType, component]))

    if (original && current) {
      currentPoList.map((po, index) => set(po, ['mapping', courseType, component], structuredClone(toRaw(original[index]))))
    }
  }

  // function loadProgramme(prog: Programme): void {
  //   originalProgramme.value = structuredClone(prog)
  //   programme.value = structuredClone(prog)
  // }

  async function save(): Promise<void> {
    draft.value.parentRevision = draft.value.revision
    draft.value.revision = formatRevision()
    draft.value.committed = {
      on: new Date(),
      by: authStore.user?.email || 'unknown'
    }
    draft.value.id = formatId(draft.value);
    try {
      await dataService.saveProgramme(draft.value);
      commit();
      addToRevisions();
    } catch (error) {
      console.error('Error saving programme:', error);
    }
  }

  function addToRevisions(): void {
    revisions.value.splice(0, 0, toRaw(draft.value))
  }

  return {
    school, revisions,
    loadProgrammeByCode, loadRevision, deleteRevision,
    draft, saved,
    editingTab,
    clear, resetDraft, createDraft, commit, save,
    // allDiff,
    checkDiff,
    resetDiff,
    checkMappingDiff,
    resetMappingDiff,
    // deleteStructure,
  }
})
