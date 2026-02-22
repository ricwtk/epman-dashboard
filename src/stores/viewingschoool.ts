import { ref, type Ref } from 'vue';
import type { School } from "@/types/school";
import { createNewSchool, getSchoolByCode } from "@/utils/schoolHelpers";
import { dataService } from "@/services/dataService";
import { defineStore } from "pinia";

export const useViewingSchoolStore = defineStore('viewing-school', () => {
  const school: Ref<School> = ref(createNewSchool())
  const schoolRevisions = ref<School[]>([])

  function resetSchool(): void { school.value = createNewSchool() }

  async function loadSchoolByCode(code: string) {
    resetSchool();
    // school.value = getSchoolByCode(code)
    schoolRevisions.value = await dataService.getSchool(code);
    schoolRevisions.value.sort((a, b) => b.revision.localeCompare(a.revision));
    if (schoolRevisions.value.length > 0) {
      school.value = schoolRevisions.value[0]!;
    }
  }

  function loadSchoolRevision(revision: string) {
    resetSchool();
    const revIndex = schoolRevisions.value.findIndex(sch => sch.revision === revision);
    if (revIndex !== -1) {
      school.value = schoolRevisions.value[revIndex]!;
    }
  }

  return { school, schoolRevisions, resetSchool, loadSchoolByCode, loadSchoolRevision }
})
