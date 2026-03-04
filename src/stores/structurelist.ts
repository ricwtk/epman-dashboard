import { defineStore } from "pinia";
import { ref } from 'vue';
import type { ProgrammeStructure, ProgrammeStructureInfo } from "@/types/programme";
import { dataService } from "@/services/dataService";
import { createStructureInfo } from "@/utils/schoolHelpers";

export const useStructureListStore = defineStore('structure-list', () => {
  const labelToInfoMap = ref<{ [structureLabel: string]: ProgrammeStructureInfo }>({});

  async function updateLabelToInfoMap(progCode: string): Promise<void> {
    const structures: { [label: string]: ProgrammeStructure } = await dataService.getStructuresByProgramme(progCode)
    labelToInfoMap.value = Object.fromEntries(
      Object.keys(structures).map(label => [ label, createStructureInfo(structures[label]!) ])
    )
  }

  return {
    labelToInfoMap,
    updateLabelToInfoMap
  }
})
