<script setup lang="ts">
import { ref, onMounted, watch, toRaw } from 'vue';
import NavIndicator from '@/components/NavIndicator.vue';
import { RevisionDropdown, RevisionDeleteButton } from '@/components/revision';

import SchoolSummary from '@/components/school/SchoolSummary.vue';
import SchoolListOfProgramme from '@/components/school/SchoolListOfProgramme.vue';
import ComponentDisplay from '@/components/school/ComponentDisplay.vue';
import SchoolUpdateDialog from '@/components/school/SchoolUpdateDialog.vue';

import { useAuthStore } from "@/stores/auth";
const authStore = useAuthStore();

const props = defineProps<{ code: string }>();

import { useViewingSchoolStore } from "@/stores/viewingschoool";
const viewingSchoolStore = useViewingSchoolStore();

onMounted(async () => {
  viewingSchoolStore.loadSchoolByCode(props.code);
  console.log(viewingSchoolStore.schoolRevisions);
});

import { useEditingSchoolStore } from "@/stores/editingschoool";
const editingSchoolStore = useEditingSchoolStore();

const editing = ref(false);
const updateEditing = (ev: boolean, tab?: string) => {
  if (ev) {
    if (editingSchoolStore.school.code !== viewingSchoolStore.school.code) {
      editingSchoolStore.loadSchool(toRaw(viewingSchoolStore.school));
    }
    editingSchoolStore.selectedTab = tab || 'summary';
  }
  editing.value = ev;
};
watch(editing, () => {
  if (!editing.value && editingSchoolStore.updated) {
    viewingSchoolStore.loadSchoolByCode(props.code);
    editingSchoolStore.updated = false;
  }
})

const deleteRevision = () => {
  viewingSchoolStore.deleteRevision();
}
</script>

<template>
  <NavIndicator :items="[
    { label: 'School', path: '/school' },
    { label: viewingSchoolStore.school.name, path: `/school/${viewingSchoolStore.school.code}` }
  ]"/>

  <template v-if="viewingSchoolStore.school">
    <div class="card-plain px-4 text-muted-foreground text-sm flex flex-row justify-start items-center gap-2">
      {{ viewingSchoolStore.school.code }} {{ viewingSchoolStore.school.name }}
      <RevisionDropdown
        :current="viewingSchoolStore.school.revision"
        :options="viewingSchoolStore.schoolRevisions.map(sch => sch.revision)"
        @selected="(rev) => viewingSchoolStore.loadSchoolRevision(rev)"
      />
      <div class="grow"></div>
      <RevisionDeleteButton @delete="deleteRevision" v-if="authStore.canEditSchools"/>
    </div>
    <SchoolSummary
      :editable="authStore.canEditSchools"
      :school="viewingSchoolStore.school"
      :editing="editing"
      @update:editing="(ev) => updateEditing(ev, 'summary')"
    />
    <SchoolListOfProgramme
      :editable="authStore.canEditSchools"
      :programmes="viewingSchoolStore.programmes!"
      :editing="editing"
      @update:editing="(ev) => updateEditing(ev, 'programmes')"
    />
    <ComponentDisplay
      :editable="authStore.canEditSchools"
      title="Washington Accord Knowledge & Attribute Profile (WK)"
      shortlabel="WK"
      :items="viewingSchoolStore.school.components?.wks || []"
      :editing="editing"
      @update:editing="(ev) => updateEditing(ev, 'wk')"
    />
    <ComponentDisplay
      :editable="authStore.canEditSchools"
      title="Washington Accord Problem Identification & Solving (WP)"
      shortlabel="WP"
      :items="viewingSchoolStore.school.components?.wps || []"
      :editing="editing"
      @update:editing="(ev) => updateEditing(ev, 'wp')"
    />
    <ComponentDisplay
      :editable="authStore.canEditSchools"
      title="Complex Engineering Activities (EA)"
      shortlabel="EA"
      :items="viewingSchoolStore.school.components?.eas || []"
      :editing="editing"
      @update:editing="(ev) => updateEditing(ev, 'ea')"
    />
    <SchoolUpdateDialog v-model:isOpen="editing" />
  </template>

</template>
