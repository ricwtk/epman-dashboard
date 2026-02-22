import { storeToRefs } from 'pinia';
import { useEditingProgrammeStore } from '@/stores/editingprogramme';
import { useEditingStructureStore } from '@/stores/editingstructure';

export function getEditingProgrammeAndStore() {
  const editingProgrammeStore = useEditingProgrammeStore();
  const { programme } = storeToRefs(editingProgrammeStore);
  return { programme, editingProgrammeStore };
}

export function getEditingStructureAndStore() {
  const editingStructureStore = useEditingStructureStore();
  const { structure } = storeToRefs(editingStructureStore);
  return { structure, editingStructureStore };
}
