import { ref, computed } from 'vue';
import { useProgrammeStore } from '@/stores/programme';

export function useProgrammeEditor() {
  const programmeStore = useProgrammeStore();
  const editing = ref(false);

  const programme = computed({
    get: () => editing.value ? programmeStore.draft : programmeStore.saved,
    set: (value) => {
      if (editing.value) programmeStore.draft = value;
      else programmeStore.saved = value;
    },
  })

  const saveProgramme = () => { programmeStore.save(); }

  const setEditing = (value: boolean) => {
    editing.value = value;
    if (programmeStore.draft.code !== programmeStore.saved.code) {
      programmeStore.createDraft();
    }
  };

  return {
    editing,
    programme,
    saveProgramme,
    setEditing,
    programmeStore
  };
}
