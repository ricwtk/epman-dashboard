import { ref, type Ref, toRaw } from 'vue';
import type { Course } from "@/types/course";
import { createNewCourse } from "@/utils/courseHelpers";
import { defineStore } from "pinia";
import { checkDiff as checkDiffCommon, resetDiff as resetDiffCommon, updateMapping as updateMappingCommon } from '@/utils/common.ts'
import {
  createPlan,
  createReference,
  createAssessment,
  createBreakdown,
} from '@/utils/courseHelpers'

export const useEditingCourseStore = defineStore('editing-course', () => {
  const course: Ref<Course> = ref(createNewCourse())
  const originalCourse: Ref<Course> = ref(createNewCourse())
  const selectedTab = ref<string>('summary')
  const updated = ref(false)

  function resetCourse(): void {
    course.value = structuredClone(toRaw(originalCourse.value))
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
    if (index > 0) {
      const reference = course.value.references[index]!;
      course.value.references.splice(index, 1);
      course.value.references.splice(index - 1, 0, reference);
    }
  }

  function moveReferenceDown(index: number): void {
    if (index < course.value.references.length - 1) {
      const reference = course.value.references[index]!;
      course.value.references.splice(index, 1);
      course.value.references.splice(index + 1, 0, reference);
    }
  }

  return {
    course, resetCourse, loadCourse,
    selectedTab, updated,
    checkDiff, resetDiff,
    updateMapping,
    updateCourse,
    addTopic, removeTopic,
    addAssessment, deleteAssessment,
    addBreakdown, deleteBreakdown,
    addReference, deleteReference, moveReferenceUp, moveReferenceDown
  }
})
