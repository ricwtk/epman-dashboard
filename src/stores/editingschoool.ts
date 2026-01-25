import { ref, type Ref } from 'vue';
import type { School } from "@/types/school";
import { createNewSchool } from "@/utils/schoolHelpers";
import { defineStore } from "pinia";

export const useEditingSchoolStore = defineStore('editing-school', () => {
  const school: Ref<School> = ref(createNewSchool())
  const originalSchool: Ref<School> = ref(createNewSchool())

  function resetSchool(): void {
    school.value = structuredClone(originalSchool.value)
  }

  function loadSchool(sch: School): void {
    console.log(sch)
    originalSchool.value = structuredClone(sch)
    school.value = structuredClone(sch)
  }

  return { school, originalSchool, resetSchool, loadSchool }
})
