import { storeToRefs } from 'pinia';
import { useEditingCourseStore } from '@/stores/editingcourse';

export function getEditingCourseAndStore() {
  const editingCourseStore = useEditingCourseStore();
  const { course } = storeToRefs(editingCourseStore);
  return { course, editingCourseStore };
}
