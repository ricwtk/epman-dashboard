import { defineStore } from "pinia";
import { ref, computed } from 'vue';
import type { CourseInfo, Course } from '@/types/course';
import { dataService } from "@/services/dataService";
import { createCourseInfo } from "@/utils/courseHelpers";

export const useCourseListStore = defineStore('course-list', () => {
  const loading = ref(false);
  const codeToInfoMap = ref<{ [courseCode: string]: CourseInfo }>({});
  const courseCodes = computed(() => Object.keys(codeToInfoMap.value))
  const courseSelections = computed(() => Object.entries(codeToInfoMap.value).map(
    ([k, v]) => ({label: `${k} ${v.name}`, value: k})
  ))
  const transferableSkillsSelections = ref<{label: string, value: string}[]>([])
  const deliveryMethodsSelections = ref<{ label: string, value: string }[]>([])

  function updateSelections() {
    const transferable = new Set<string>()
    const delivery = new Set<string>()
    Object.values(codeToInfoMap.value).forEach((course) => {
      course.transferableSkills.forEach(ts => transferable.add(ts))
      course.deliveryMethods.forEach(dm => delivery.add(dm))
    })

    transferableSkillsSelections.value = Array.from(transferable).map(
      (v) => ({label: v, value: v})
    )
    deliveryMethodsSelections.value = Array.from(delivery).map(
      (v) => ({label: v, value: v})
    )
  }
  function addSelectionItem(key: 'transferableSkills' | 'deliveryMethods', value: string): void {
    const set = key === 'transferableSkills' ? transferableSkillsSelections.value : deliveryMethodsSelections.value
    const existing = set.find(item => item.value === value)
    if (!existing) {
      set.push({ label: value, value })
    }
  }
  function addTransferableSkill(value: string): void { addSelectionItem('transferableSkills', value) }
  function addDeliveryMethod(value: string): void { addSelectionItem('deliveryMethods', value) }

  async function init(): Promise<void> {
    await updateCodeToInfoMap()
    updateSelections()
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
    courseCodes, courseSelections,
    transferableSkillsSelections, deliveryMethodsSelections,
    addSelectionItem,
    addTransferableSkill,
    addDeliveryMethod,
    codeToInfoMap,
    updateCodeToInfoMap,
    getCourseInfoInStructure,
    saveCourseUpdate
  }
})
