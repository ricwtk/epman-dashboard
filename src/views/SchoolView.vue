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

import { useSchoolStore } from "@/stores/school";
const schoolStore = useSchoolStore();

const props = defineProps<{ code: string }>();

// import { useViewingSchoolStore } from "@/stores/viewingschoool";
// const viewingSchoolStore = useViewingSchoolStore();

onMounted(async () => {
  schoolStore.loadSchoolByCode(props.code);
  // console.log(viewingSchoolStore.schoolRevisions);
});

// import { useEditingSchoolStore } from "@/stores/editingschoool";
// const editingSchoolStore = useEditingSchoolStore();

const editing = ref(false);
const updateEditing = (ev: boolean, tab?: string) => {
  if (ev) {
    if (schoolStore.draft.code !== schoolStore.saved.code) {
      schoolStore.createDraft();
    }
    schoolStore.editingTab = tab || 'summary';
  }
  editing.value = ev;
};
</script>

<template>
  <NavIndicator :items="[
    { label: 'School', path: '/school' },
    { label: schoolStore.saved.name, path: `/school/${schoolStore.saved.code}` }
  ]"/>

  <template v-if="schoolStore.saved">
    <div class="card-plain px-4 text-muted-foreground text-sm flex flex-row justify-start items-center gap-2">
      {{ schoolStore.saved.code }} {{ schoolStore.saved.name }}
      <RevisionDropdown
        :current="schoolStore.saved.revision"
        :options="schoolStore.revisions.map(sch => sch.revision)"
        @selected="(rev) => schoolStore.loadRevision(rev)"
      />
      <div class="grow"></div>
      <RevisionDeleteButton @delete="schoolStore.deleteRevision()" v-if="authStore.canEditSchools"/>
    </div>
    <SchoolSummary
      :editable="authStore.canEditSchools"
      :school="schoolStore.saved"
      :editing="editing"
      @update:editing="(ev) => updateEditing(ev, 'summary')"
    />
    <SchoolListOfProgramme
      :editable="authStore.canEditSchools"
      :programmes="schoolStore.saved.programmes.map(p => ({ code: p, name: schoolStore.programmeToSchoolMap[p]?.name || '' }))"
      :editing="editing"
      @update:editing="(ev) => updateEditing(ev, 'programmes')"
    />
    <ComponentDisplay
      :editable="authStore.canEditSchools"
      title="Washington Accord Knowledge & Attribute Profile (WK)"
      shortlabel="WK"
      :items="schoolStore.saved.components?.wks || []"
      :editing="editing"
      @update:editing="(ev) => updateEditing(ev, 'wk')"
    />
    <ComponentDisplay
      :editable="authStore.canEditSchools"
      title="Washington Accord Problem Identification & Solving (WP)"
      shortlabel="WP"
      :items="schoolStore.saved.components?.wps || []"
      :editing="editing"
      @update:editing="(ev) => updateEditing(ev, 'wp')"
    />
    <ComponentDisplay
      :editable="authStore.canEditSchools"
      title="Complex Engineering Activities (EA)"
      shortlabel="EA"
      :items="schoolStore.saved.components?.eas || []"
      :editing="editing"
      @update:editing="(ev) => updateEditing(ev, 'ea')"
    />
    <SchoolUpdateDialog v-model:isOpen="editing" />
  </template>

</template>
