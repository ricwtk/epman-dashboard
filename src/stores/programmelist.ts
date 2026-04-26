import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Programme } from '@/types/programme';
import { dataService } from '@/services/dataService';
import type { School, AttrDesc } from '@/types/school';
import { createNewSchool } from '@/utils/schoolHelpers';

interface ProgrammeInfo extends Programme {
  school: School
}

export const useProgrammeListStore = defineStore('programme-list', () => {
  const loading = ref(false)
  const codeToProgrammeMap = ref<{ [programmeCode: string]: ProgrammeInfo }>({});
  const programmeSelections = computed(() => Object.entries(codeToProgrammeMap.value).map(
    ([code, programme]) => ({ value: code, label: programme.name })
  ))
  const programmeCodeSelected = ref('')
  const selectedProgramme = computed(() => codeToProgrammeMap.value[programmeCodeSelected.value])
  const selectedSchool = computed(() => selectedProgramme.value?.school)
  const polist = computed<Array<[string, string]>>(() => selectedProgramme.value?.poList.map(
    (po, poIndex) => [`PO${poIndex + 1}`, po.attribute]
  ) || [])
  const wklist = computed<Array<[string, string]>>(() => selectedSchool.value?.components?.wks?.map(
    (wk: AttrDesc, wkIndex: number) => [`WK${wkIndex + 1}`, wk.descriptor]
  ) || [])
  const wplist = computed<Array<[string, string]>>(() => selectedSchool.value?.components?.wps?.map(
    (wp: AttrDesc, wpIndex: number) => [`WP${wpIndex + 1}`, wp.descriptor]
  ) || [])
  const ealist = computed<Array<[string, string]>>(() => selectedSchool.value?.components?.eas?.map(
    (ea: AttrDesc, eaIndex: number) => [`EA${eaIndex + 1}`, ea.descriptor]
  ) || [])

  async function fetchProgrammes() {
    loading.value = true;
    const schools = await dataService.getSchools();
    const programmes = await dataService.getProgrammes();
    for (const programmeCode in programmes) {
      const programme = programmes[programmeCode]!;
      const school = schools.find(s => s.programmes.includes(programme.code));
      codeToProgrammeMap.value[programme.code] = {
        ...programme,
        school: school ?? createNewSchool(),
      };
    }
    if (programmeSelections.value.length > 0 && programmeCodeSelected.value === "") {
      programmeCodeSelected.value = programmeSelections.value[0]?.value || "";
    }
    loading.value = false;
  }
  fetchProgrammes();

  return {
    codeToProgrammeMap,
    programmeSelections,
    programmeCodeSelected,
    polist, wklist, wplist, ealist,
    selectedProgramme,
    selectedSchool,
    fetchProgrammes,
  };
});
