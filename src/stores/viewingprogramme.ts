import { ref, type Ref } from 'vue';
import type { Programme } from "@/types/programme";
import { createNewProgramme, getProgrammeByCode } from "@/utils/programmeHelpers";
import { defineStore } from "pinia";

export const useViewingProgrammeStore = defineStore('viewing-programme', () => {
  const programme: Ref<Programme> = ref(createNewProgramme())

  function resetProgramme(): void { programme.value = createNewProgramme() }

  function loadProgrammeByCode(code: string) {
    resetProgramme();
    programme.value = getProgrammeByCode(code)
  }

  return { programme, resetProgramme, loadProgrammeByCode }
})
