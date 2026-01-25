<script setup lang="ts">
import { ref, onMounted, watch, toRaw } from 'vue';
import NavIndicator from '@/components/NavIndicator.vue';
import { Badge } from '@/components/ui/badge';

import SchoolSummary from '@/components/school/SchoolSummary.vue';
import ComponentDisplay from '@/components/school/ComponentDisplay.vue';
import SchoolUpdateDialog from '@/components/school/SchoolUpdateDialog.vue';

const props = defineProps<{ code: string }>();

import { useViewingSchoolStore } from "@/stores/viewingschoool";
const viewingSchoolStore = useViewingSchoolStore();

onMounted(() => {
  viewingSchoolStore.loadSchoolByCode(props.code);
});

import { useEditingSchoolStore } from "@/stores/editingschoool";
const editingSchoolStore = useEditingSchoolStore();

const editing = ref(false);
const updateEditing = (ev: boolean, ) => {
  if (ev) {
    if (editingSchoolStore.school.code !== viewingSchoolStore.school.code) {
      editingSchoolStore.loadSchool(toRaw(viewingSchoolStore.school));
    }
  }
  editing.value = ev;
};

</script>

<template>
  <NavIndicator :items="[
    { label: 'School', path: '/schools' },
    { label: 'School View', path: '/schools/:id' }
  ]"/>

  <template v-if="viewingSchoolStore.school">
    <div class="card-plain px-4 text-muted-foreground text-sm">
      {{ viewingSchoolStore.school.code }} {{ viewingSchoolStore.school.name }}
      <Badge>{{ viewingSchoolStore.school.revision }}</Badge>
    </div>
    <SchoolSummary
      :school="viewingSchoolStore.school"
      :editing="editing"
      @update:editing="updateEditing"
    />
    <ComponentDisplay
      title="Washington Accord Knowledge & Attribute Profile (WK)"
      shortlabel="WK"
      :items="viewingSchoolStore.school.components?.wks || []"
      :editing="editing"
      @update:editing="updateEditing"
    />
    <ComponentDisplay
      title="Washington Accord Problem Identification & Solving (WP)"
      shortlabel="WP"
      :items="viewingSchoolStore.school.components?.wps || []"
      :editing="editing"
      @update:editing="updateEditing"
    />
    <ComponentDisplay
      title="Complex Engineering Activities (EA)"
      shortlabel="EA"
      :items="viewingSchoolStore.school.components?.eas || []"
      :editing="editing"
      @update:editing="updateEditing"
    />
    <SchoolUpdateDialog v-model:isOpen="editing" />
  </template>

</template>
