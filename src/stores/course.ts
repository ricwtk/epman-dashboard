import { ref, computed, toRaw, watch } from 'vue';
import type { Course } from "@/types/course";
import type { Programme } from "@/types/programme";
import type { School } from "@/types/school";
import { createCourseObject } from "@/utils/courseHelpers";
import { defineStore } from "pinia";
import { checkDiff as checkDiffCommon, resetDiff as resetDiffCommon, updateMapping as updateMappingCommon } from '@/utils/common.ts'
import {
  createCo,
  createPlan,
  createReference,
  createAssessment,
  createBreakdown,
} from '@/utils/courseHelpers'
import { formatRevision, formatId } from '@/utils/common';
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();
import { dataService } from '@/services/dataService';
import type { SchoolsByCode, ProgrammesWithCourse } from '@/services/dataService';
import { navigateToParent } from '@/utils/navigationHelpers'

export const useCourseStore = defineStore('course', () => {
  const draft = ref<Course>(createCourseObject())
  const saved = ref<Course>(createCourseObject())
  const revisions = ref<Course[]>([])

  // parameters for editing ui
  const editingTab = ref<string>('summary')

  // programme and school parameters
  const programmes = ref<ProgrammesWithCourse>({})
  const schools = ref<SchoolsByCode>({})
  const selectedProgramme = ref<Programme | null>(null)
  const selectedSchool = computed<School | null>(() => {
    if (!selectedProgramme.value) return null;
    const schoolCode = programmes.value[selectedProgramme.value.code]?.school;
    return schoolCode ? schools.value[schoolCode] || null : null;
  });
  const notAssignedToProgramme = computed<boolean>(() => {
    return Object.keys(programmes.value).length === 0;
  })
  const programmeNotSelected = computed<boolean>(() => {
    return selectedProgramme.value === null || Object.keys(selectedProgramme.value).length === 0;
  })
  const programmeNotAssigned = computed<boolean>(() => {
    return !programmeNotSelected.value && (selectedSchool.value === null);
  })



  watch(() => draft.value.code, async () => {
    if (!draft.value.code) return;
    const usage = await dataService.traceCourseUsageAcrossProgrammes(draft.value.code)
    programmes.value = usage.programmes
    schools.value = usage.schools
  })

  function clear(): void { draft.value = createCourseObject(); saved.value = createCourseObject(); }
  function reset(): void { draft.value = structuredClone(toRaw(saved.value)); }
  function commit(): void { saved.value = structuredClone(toRaw(draft.value)); }

  async function loadCourseByCode(code: string): Promise<void> {
    clear()
    revisions.value = await dataService.getCourse(code)
    revisions.value.sort((a, b) => b.revision.localeCompare(a.revision));
    if (revisions.value.length > 0) {
      saved.value = revisions.value[0]!;
    }
  }

  function loadRevision(revision: string) {
    clear();
    const revIndex = revisions.value.findIndex(cour => cour.revision === revision);
    if (revIndex !== -1) {
      saved.value = revisions.value[revIndex]!;
    }
  }

  async function deleteRevision() {
    if (saved.value.id !== "") {
      await dataService.deleteItem('courses', saved.value.id);
      const revIndex = revisions.value.findIndex(cour => cour.id === saved.value.id)
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

  function resetDiff(pathArray: string[]): void { resetDiffCommon(draft.value, saved.value, pathArray) }
  function checkDiff(pathArray: string[]): boolean { return checkDiffCommon(draft.value, saved.value, pathArray) }

  function updateMapping(pathArray: string[], itemIndex: number, isChecked: boolean | 'indeterminate'): void {
    updateMappingCommon(draft.value, pathArray, itemIndex, isChecked)
  }

  // function checkMappingDiff(coursetype: "examBased" | "projectBased", component: "wk" | "wp" | "ea"): boolean {
  //   const originalPoList = originalProgramme.value.poList
  //   const original = originalPoList.map(po => get(po, ['mapping', coursetype, component]))

  //   const currentPoList = programme.value.poList
  //   const current = currentPoList.map(po => get(po, ['mapping', coursetype, component]))

  //   if (original && current) {
  //     return diff(original, current).length > 0 || original.length !== current.length;
  //   } else return true;
  // }

  // function resetMappingDiff(coursetype: "examBased" | "projectBased", component: "wk" | "wp" | "ea"): void {
  //   const originalPoList = originalProgramme.value.poList
  //   const original = originalPoList.map(po => get(po, ['mapping', coursetype, component]))

  //   const currentPoList = programme.value.poList
  //   const current = currentPoList.map(po => get(po, ['mapping', coursetype, component]))

  //   if (original && current) {
  //     currentPoList.map((po, index) => set(po, ['mapping', coursetype, component], structuredClone(toRaw(original[index]))))
  //   }
  // }


  function addCo(): void { draft.value.cos.push(createCo()) }
  function removeCo(index: number): void { draft.value.cos.splice(index, 1) }
  function moveCoUp(index: number): void { moveUp('cos', index); }
  function moveCoDown(index: number): void { moveDown('cos', index); }

  function addAssessment(): void { draft.value.assessments.push(createAssessment()) }
  function deleteAssessment(index: number): void { draft.value.assessments.splice(index, 1) }

  function addBreakdown(assessmentIndex: number): void {
    if (assessmentIndex >= 0 && assessmentIndex < draft.value.assessments.length) {
      draft.value.assessments[assessmentIndex]!.breakdown.push(createBreakdown())
    }
  }
  function deleteBreakdown(assessmentIndex: number, breakdownIndex: number): void {
    if (assessmentIndex >= 0 && assessmentIndex < draft.value.assessments.length) {
      draft.value.assessments[assessmentIndex]!.breakdown.splice(breakdownIndex, 1)
    }
  }

  function addTopic(): void { draft.value.teachingPlan.push(createPlan()) }
  function removeTopic(index: number): void { draft.value.teachingPlan.splice(index, 1) }

  function addReference(): void { draft.value.references.push(createReference()) }
  function deleteReference(index: number): void { draft.value.references.splice(index, 1) }
  function moveReferenceUp(index: number): void { moveUp('references', index); }
  function moveReferenceDown(index: number): void { moveDown('references', index); }

  async function save(): Promise<void> {
    draft.value.parentRevision = draft.value.revision
    draft.value.revision = formatRevision()
    draft.value.committed = {
      on: new Date(),
      by: authStore.user?.email || 'unknown'
    }
    draft.value.id = formatId(draft.value);
    try {
      await dataService.saveCourse(draft.value);
      commit();
    } catch (error) {
      console.error('Error saving course:', error);
    }
  }

  function moveUp(keyOfList: keyof Course, index: number): void {
    if (Array.isArray(draft.value[keyOfList])) {
      if (index > 0) {
        const item = draft.value[keyOfList].splice(index, 1)[0];
        draft.value[keyOfList].splice(index - 1, 0, item);
      }
    }
  }

  function moveDown(keyOfList: keyof Course, index: number): void {
    if (Array.isArray(draft.value[keyOfList])) {
      if (index < draft.value[keyOfList].length - 1) {
        const item = draft.value[keyOfList].splice(index, 1)[0];
        draft.value[keyOfList].splice(index + 1, 0, item);
      }
    }
  }

  return {
    draft, saved,
    loadCourseByCode, loadRevision, deleteRevision,
    clear, reset, save,
    selectedProgramme, selectedSchool,
    notAssignedToProgramme, programmeNotSelected, programmeNotAssigned,
    editingTab,
    checkDiff, resetDiff,
    updateMapping,
    addCo, removeCo, moveCoUp, moveCoDown,
    addTopic, removeTopic,
    addAssessment, deleteAssessment,
    addBreakdown, deleteBreakdown,
    addReference, deleteReference, moveReferenceUp, moveReferenceDown,
  }
})
