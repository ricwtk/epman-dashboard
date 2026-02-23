import { ref } from 'vue';
import type { Programme } from "@/types/programme";
import { createNewProgramme, getProgrammeByCode } from "@/utils/programmeHelpers";
import { defineStore } from "pinia";
import { dataService } from "@/services/dataService";
import { navigateToParent } from "@/utils/navigationHelpers";

export const useViewingProgrammeStore = defineStore('viewing-programme', () => {
  const programme = ref<Programme>(createNewProgramme())
  const programmeRevisions = ref<Programme[]>([])

  function resetProgramme(): void { programme.value = createNewProgramme() }

  async function loadProgrammeByCode(code: string) {
    resetProgramme();
    // programme.value = getProgrammeByCode(code)
    programmeRevisions.value = await dataService.getProgramme(code);
    programmeRevisions.value.sort((a, b) => b.revision.localeCompare(a.revision));
    if (programmeRevisions.value.length > 0) {
      programme.value = programmeRevisions.value[0]!;
    }
  }

  function loadProgrammeRevision(revision: string) {
    resetProgramme();
    const revIndex = programmeRevisions.value.findIndex(prog => prog.revision === revision);
    if (revIndex !== -1) {
      programme.value = programmeRevisions.value[revIndex]!;
    }
  }

  async function deleteRevision() {
    if (programme.value.id !== "") {
      await dataService.deleteItem('programmes', programme.value.id);
      const revIndex = programmeRevisions.value.findIndex(prog => prog.id === programme.value.id)
      programmeRevisions.value.splice(revIndex, 1);
      if (revIndex < programmeRevisions.value.length) {
        programme.value = programmeRevisions.value[revIndex]!;
      } else if (programmeRevisions.value.length > 0) {
        programme.value = programmeRevisions.value[programmeRevisions.value.length - 1]!;
      } else {
        resetProgramme();
        navigateToParent();
      }
    }
  }

  return { programme, programmeRevisions, resetProgramme, loadProgrammeByCode, loadProgrammeRevision, deleteRevision }
})
