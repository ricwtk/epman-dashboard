<script setup lang="ts">
import { ref, onMounted, watch, toRaw } from 'vue';
import NavIndicator from '@/components/NavIndicator.vue';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem } from '@/components/ui/dropdown-menu';

import SchoolSummary from '@/components/school/SchoolSummary.vue';
import ComponentDisplay from '@/components/school/ComponentDisplay.vue';
import SchoolUpdateDialog from '@/components/school/SchoolUpdateDialog.vue';

const props = defineProps<{ code: string }>();

import { useViewingSchoolStore } from "@/stores/viewingschoool";
const viewingSchoolStore = useViewingSchoolStore();

onMounted(() => {
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

</script>

<template>
  <NavIndicator :items="[
    { label: 'School', path: '/school' },
    { label: viewingSchoolStore.school.name, path: `/school/${viewingSchoolStore.school.code}` }
  ]"/>

  <template v-if="viewingSchoolStore.school">
    <div class="card-plain px-4 text-muted-foreground text-sm">
      {{ viewingSchoolStore.school.code }} {{ viewingSchoolStore.school.name }}
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Badge>{{ viewingSchoolStore.school.revision }}</Badge>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="text-xs">
          <DropdownMenuGroup>
            <DropdownMenuItem v-for="rev in viewingSchoolStore.schoolRevisions.map(sch => sch.revision)" @click="viewingSchoolStore.loadSchoolRevision(rev)">
              {{ rev }}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
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
      @update:editing="(ev) => updateEditing(ev, 'wk')"
    />
    <ComponentDisplay
      title="Washington Accord Problem Identification & Solving (WP)"
      shortlabel="WP"
      :items="viewingSchoolStore.school.components?.wps || []"
      :editing="editing"
      @update:editing="(ev) => updateEditing(ev, 'wp')"
    />
    <ComponentDisplay
      title="Complex Engineering Activities (EA)"
      shortlabel="EA"
      :items="viewingSchoolStore.school.components?.eas || []"
      :editing="editing"
      @update:editing="(ev) => updateEditing(ev, 'ea')"
    />
    <SchoolUpdateDialog v-model:isOpen="editing" />
  </template>

</template>
