import { defineStore } from "pinia";
import { ref, watch, computed } from 'vue';
import type { ProgrammeStructure, ProgrammeStructureInfo } from "@/types/programme";
import { createNewStructure, createStructureInfo } from "@/utils/structureHelpers";
import { dataService } from "@/services/dataService";

export const useViewingStructureStore = defineStore("viewing-structure", () => {
  const programmeCode = ref<string>("")
  const structureRevisions = ref<{ [revision: string]: ProgrammeStructure }>({})
  const revisions = computed<string[]>(() => Object.keys(structureRevisions.value).sort((a,b) => b.localeCompare(a)))

  const selectedStructureLabel = ref<string>("")
  const structure = ref<ProgrammeStructure>(createNewStructure())
  function resetStructure(): void {
    structure.value = createNewStructure();
    selectedStructureLabel.value = ""
  }

  async function loadStructureRevisionsByProgrammeAndLabel(programme: string, label: string) {
    structureRevisions.value = await dataService.getStructureRevisionsByProgrammeAndLabel(programme, label)
  }
  watch([programmeCode, selectedStructureLabel], () => {
    if (programmeCode.value && selectedStructureLabel.value) {
      loadStructureRevisionsByProgrammeAndLabel(
        programmeCode.value,
        selectedStructureLabel.value
      )
    }
  })

  const selectedRevision = ref<string>("")
  watch(structureRevisions, () => {
    if (revisions.value.length < 1) { selectedRevision.value = "" }
    else if (
      !selectedRevision.value
      || !revisions.value.includes(selectedRevision.value)
    ) { selectedRevision.value = revisions.value[0] || "" }
    else { loadStructure(); }
  })
  watch(selectedRevision, () => loadStructure())
  function loadStructure() {
    if (revisions.value.includes(selectedRevision.value)) {
      structure.value = structureRevisions.value[selectedRevision.value]!
    }
  }

  return {
    programmeCode,
    structure,
    structureRevisions,
    revisions,
    selectedStructureLabel,
    selectedRevision,
    resetStructure,
    loadStructureRevisionsByProgrammeAndLabel
  }
})
