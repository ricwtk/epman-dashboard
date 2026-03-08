import { defineStore } from "pinia";
import { ref } from 'vue';
import type { CourseInfo, Course } from '@/types/course';
import { dataService } from "@/services/dataService";
import { createCourseInfo } from "@/utils/courseHelpers";

export const useCourseListStore = defineStore('course-list', () => {
  const loading = ref(false);
  const codeToInfoMap = ref<{ [courseCode: string]: CourseInfo }>({});

  async function init(): Promise<void> {
    await updateCodeToInfoMap()
  }
  init();

  async function updateCodeToInfoMap(): Promise<void> {
    loading.value = true;
    const courses: { [code: string]: Course } = await dataService.getCourses()
    codeToInfoMap.value = Object.fromEntries(
      Object.keys(courses).map(courseCode => [ courseCode, createCourseInfo(courses[courseCode]!) ])
    )
    loading.value = false;
  }

  function saveCourseUpdate(course: Partial<Course>): void {
    loading.value = true;
    const code = course.code
    if (code) {
      codeToInfoMap.value[code] = createCourseInfo(course)
    }
    loading.value = false;
  }

  function getCourseInfoInStructure(
    structure: { [semesterKey: string]: string[] }
  ): { [semesterKey: string]: CourseInfo[] } {
    loading.value = true;
    const results = Object.fromEntries(
      Object.entries(structure).map(([semesterKey, coursesInSem]) => [
        semesterKey,
        coursesInSem.map((courseKey: string) => codeToInfoMap.value[courseKey] || createCourseInfo({ code: courseKey })),
      ])
    );
    loading.value = false;
    return results;
  }

  return {
    loading,
    codeToInfoMap,
    updateCodeToInfoMap,
    getCourseInfoInStructure,
    saveCourseUpdate
  }
})
