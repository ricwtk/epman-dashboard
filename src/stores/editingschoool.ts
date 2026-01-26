import { ref, type Ref, toRaw } from 'vue';
import type { School } from "@/types/school";
import { createNewSchool } from "@/utils/schoolHelpers";
import { defineStore } from "pinia";
import { get, set } from 'lodash-es';
import diff from 'microdiff';

export const useEditingSchoolStore = defineStore('editing-school', () => {
  const school: Ref<School> = ref(createNewSchool())
  const originalSchool: Ref<School> = ref(createNewSchool())

  function resetSchool(): void {
    school.value = structuredClone(toRaw(originalSchool.value))
  }

  function resetDiff(pathArray: string[]): void {
    const original = get(originalSchool.value, pathArray)
    set(school.value, pathArray, original)
  }

  function checkDiff(pathArray: string[]): boolean {
    if (!pathArray.length)
      return diff(school.value, originalSchool.value).length > 0;
    const original = get(originalSchool.value, pathArray)
    const current = get(school.value, pathArray)
    if (original && current) {
      return diff(original, current).length > 0 || original.length !== current.length;
    } else return true;
  }

  function loadSchool(sch: School): void {
    originalSchool.value = structuredClone(sch)
    school.value = structuredClone(sch)
  }

  return { school, resetSchool, loadSchool, checkDiff, resetDiff }
})
