import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { type Course } from '@/types/course'
import { createNewCourse, getCourseByCode } from '@/utils/courseHelpers'

export const useViewingCourseStore = defineStore('viewing-course', () => {
  const course = ref<Course>(createNewCourse())

  function resetCourse(): void {
    course.value = createNewCourse()
  }

  function loadCourseByCode(code: string): void  {
    resetCourse()
    course.value = getCourseByCode(code) || createNewCourse({ code: code })
  }

  return { course, loadCourseByCode }
})
