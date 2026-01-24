import { ref, type Ref } from 'vue';
import type { School } from "@/types/school";
import { createNewSchool, getSchoolByCode } from "@/utils/schoolHelpers";
import { defineStore } from "pinia";

export const useViewingSchoolStore = defineStore('viewing-school', () => {
  const school: Ref<School> = ref(createNewSchool())

  function resetSchool(): void { school.value = createNewSchool() }

  function loadSchoolByCode(code: string) {
    resetSchool();
    school.value = getSchoolByCode(code)
  }

  return { school, resetSchool, loadSchoolByCode }
})
