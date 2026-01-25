import { storeToRefs } from 'pinia';
import { useEditingSchoolStore } from '@/stores/editingschoool';

export function getEditingSchoolAndStore() {
  const editingSchoolStore = useEditingSchoolStore();
  const { school } = storeToRefs(editingSchoolStore);
  return { school, editingSchoolStore };
}
