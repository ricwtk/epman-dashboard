import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { type Course } from '@/types/course'
import { createNewCourse, getCourseByCode } from '@/utils/courseHelpers'
import { dataService } from '@/services/dataService'
import { navigateToParent } from '@/utils/navigationHelpers'

export const useViewingCourseStore = defineStore('viewing-course', () => {
  const course = ref<Course>(createNewCourse())
  const courseRevisions = ref<Course[]>([])

  function resetCourse(): void {
    course.value = createNewCourse()
  }

  async function loadCourseByCode(code: string)  {
    resetCourse()
    // course.value = getCourseByCode(code) || createNewCourse({ code: code })
    courseRevisions.value = await dataService.getCourse(code)
    courseRevisions.value.sort((a, b) => b.revision.localeCompare(a.revision));
    if (courseRevisions.value.length > 0) {
      course.value = courseRevisions.value[0]!;
    }
  }

  function loadCourseRevision(revision: string) {
    resetCourse();
    const revIndex = courseRevisions.value.findIndex(cour => cour.revision === revision);
    if (revIndex !== -1) {
      course.value = courseRevisions.value[revIndex]!;
    }
  }

  async function deleteRevision() {
    if (course.value.id !== "") {
      await dataService.deleteItem('courses', course.value.id);
      const revIndex = courseRevisions.value.findIndex(cour => cour.id === course.value.id)
      courseRevisions.value.splice(revIndex, 1);
      if (revIndex < courseRevisions.value.length) {
        course.value = courseRevisions.value[revIndex]!;
      } else if (courseRevisions.value.length > 0) {
        course.value = courseRevisions.value[courseRevisions.value.length - 1]!;
      } else {
        resetCourse();
        navigateToParent();
      }
    }
  }

  return { course, courseRevisions, loadCourseByCode, loadCourseRevision, deleteRevision }
})
