import { ref, computed, toRaw } from 'vue';
import type { Course } from "@/types/course";
import type { Programme } from "@/types/programme";
import type { School } from "@/types/school";
import { createNewCourse } from "@/utils/courseHelpers";
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
import { createNewProgramme } from '@/utils/programmeHelpers';
import { createNewSchool } from '@/utils/schoolHelpers';
import { computedAsync } from '@vueuse/core';

export const useEditingCourseStore = defineStore('editing-course', () => {
  const course = ref<Course>(createNewCourse())
  const originalCourse = ref<Course>(createNewCourse())
  const selectedTab = ref<string>('summary')
  const updated = ref(false)
  const courseUsage = computedAsync<{
    programmes: ProgrammesWithCourse,
    schools: SchoolsByCode
  }>(async () => {
    return await dataService.traceCourseUsageAcrossProgrammes(course.value.code)
  })

  function resetCourse(): void {
    course.value = structuredClone(toRaw(originalCourse.value))
  }

  function commitCourse(): void {
    originalCourse.value = structuredClone(toRaw(course.value));
  }

  function resetDiff(pathArray: string[]): void {
    resetDiffCommon(course.value, originalCourse.value, pathArray)
  }

  function checkDiff(pathArray: string[]): boolean {
    return checkDiffCommon(course.value, originalCourse.value, pathArray)
  }

  function updateMapping(pathArray: string[], itemIndex: number, isChecked: boolean | 'indeterminate'): void {
    updateMappingCommon(course.value, pathArray, itemIndex, isChecked)
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

  function loadCourse(cse: Course): void {
    originalCourse.value = structuredClone(cse)
    course.value = structuredClone(cse)
  }

  function updateCourse(course: Course): void {
  }

  function addCo(): void {
    course.value.cos.push(createCo())
  }

  function removeCo(index: number): void {
    course.value.cos.splice(index, 1)
  }

  function moveCoUp(index: number): void {
    moveUp('cos', index);
  }

  function moveCoDown(index: number): void {
    moveDown('cos', index);
  }

  function addAssessment(): void {
    course.value.assessments.push(createAssessment())
  }

  function deleteAssessment(index: number): void {
    course.value.assessments.splice(index, 1)
  }

  function addBreakdown(assessmentIndex: number): void {
    if (assessmentIndex >= 0 && assessmentIndex < course.value.assessments.length) {
      course.value.assessments[assessmentIndex]!.breakdown.push(createBreakdown())
    }
  }

  function deleteBreakdown(assessmentIndex: number, breakdownIndex: number): void {
    if (assessmentIndex >= 0 && assessmentIndex < course.value.assessments.length) {
      course.value.assessments[assessmentIndex]!.breakdown.splice(breakdownIndex, 1)
    }
  }

  function addTopic(): void {
    course.value.teachingPlan.push(createPlan())
  }

  function removeTopic(index: number): void {
    course.value.teachingPlan.splice(index, 1)
  }

  function addReference(): void {
    course.value.references.push(createReference())
  }

  function deleteReference(index: number): void {
    course.value.references.splice(index, 1)
  }

  function moveReferenceUp(index: number): void {
    moveUp('references', index);
    // if (index > 0) {
    //   const reference = course.value.references[index]!;
    //   course.value.references.splice(index, 1);
    //   course.value.references.splice(index - 1, 0, reference);
    // }
  }

  function moveReferenceDown(index: number): void {
    moveDown('references', index);
    // if (index < course.value.references.length - 1) {
    //   const reference = course.value.references[index]!;
    //   course.value.references.splice(index, 1);
    //   course.value.references.splice(index + 1, 0, reference);
    // }
  }

  async function saveCourse(): Promise<void> {
    course.value.parentRevision = course.value.revision
    course.value.revision = formatRevision()
    course.value.committed = {
      on: new Date(),
      by: authStore.user?.email || 'unknown'
    }
    course.value.id = formatId(course.value);
    try {
      await dataService.saveCourse(course.value);
      commitCourse();
      updated.value = true;
    } catch (error) {
      console.error('Error saving course:', error);
    }
  }

  function moveUp(keyOfList: keyof Course, index: number): void {
    if (Array.isArray(course.value[keyOfList])) {
      if (index > 0) {
        const item = course.value[keyOfList].splice(index, 1)[0];
        course.value[keyOfList].splice(index - 1, 0, item);
      }
    }
  }

  function moveDown(keyOfList: keyof Course, index: number): void {
    if (Array.isArray(course.value[keyOfList])) {
      if (index < course.value[keyOfList].length - 1) {
        const item = course.value[keyOfList].splice(index, 1)[0];
        course.value[keyOfList].splice(index + 1, 0, item);
      }
    }
  }

  return {
    course, resetCourse, loadCourse,
    courseUsage,
    selectedTab, updated,
    checkDiff, resetDiff,
    updateMapping,
    updateCourse,
    addCo, removeCo, moveCoUp, moveCoDown,
    addTopic, removeTopic,
    addAssessment, deleteAssessment,
    addBreakdown, deleteBreakdown,
    addReference, deleteReference, moveReferenceUp, moveReferenceDown,
    saveCourse
  }
})
