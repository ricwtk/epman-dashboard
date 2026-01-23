import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { type Course } from '@/types/course'

export const useCourseViewStore = defineStore('course-view', () => {
  const course = ref<Course | null>(null)


  return { course }
})
