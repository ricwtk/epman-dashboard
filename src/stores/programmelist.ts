import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Programme } from '@/types/programme';
import { dataService } from '@/services/dataService';
import type { School } from '@/types/school';
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
  const programmeLoaded = ref(false)

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
    programmeLoaded.value = true;
    loading.value = false;
  }
  fetchProgrammes();

  return {
    codeToProgrammeMap,
    programmeSelections,
    programmeLoaded,
    fetchProgrammes,
  };
});
