import { storeToRefs } from 'pinia';
import { useEditingProgrammeStore } from '@/stores/editingprogramme';

export function getEditingProgrammeAndStore() {
  const editingProgrammeStore = useEditingProgrammeStore();
  const { programme } = storeToRefs(editingProgrammeStore);
  return { programme, editingProgrammeStore };
}
