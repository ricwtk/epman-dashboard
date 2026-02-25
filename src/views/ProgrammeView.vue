<script setup lang="ts">
import { onMounted, ref, toRaw, watch } from 'vue';
import { Badge } from '@/components/ui/badge';
import NavIndicator from '@/components/NavIndicator.vue';
import { RevisionDropdown, RevisionDeleteButton } from '@/components/revision';

import ProgrammeSummary from '@/components/programme/ProgrammeSummary.vue';
import ProgrammePeo from '@/components/programme/ProgrammePeo.vue';
import ProgrammePo from '@/components/programme/ProgrammePo.vue';
import PoMapping from '@/components/programme/PoMapping.vue';
import ProgrammeUpdateDialog from '@/components/programme/ProgrammeUpdateDialog.vue';
import ProgrammeStructure from '@/components/programme/ProgrammeStructure.vue';

import { useAuthStore } from "@/stores/auth";
const authStore = useAuthStore();

import { useViewingProgrammeStore } from '@/stores/viewingprogramme';
const viewingProgrammeStore = useViewingProgrammeStore();

const props = defineProps<{ code: string }>();
onMounted(() => {
  viewingProgrammeStore.loadProgrammeByCode(props.code);
  console.log(viewingProgrammeStore.programmeRevisions)
});

import { useEditingProgrammeStore } from "@/stores/editingprogramme";
const editingProgrammeStore = useEditingProgrammeStore();

const editing = ref(false);
const updateEditing = (ev: boolean, tab?: string) => {
  if (ev) {
    if (editingProgrammeStore.programme.code !== viewingProgrammeStore.programme.code) {
      editingProgrammeStore.loadProgramme(toRaw(viewingProgrammeStore.programme));
    }
    editingProgrammeStore.selectedTab = tab || 'summary';
  }
  editing.value = ev;
};
watch(editing, () => {
  if (!editing.value && editingProgrammeStore.updated) {
    viewingProgrammeStore.loadProgrammeByCode(props.code);
    editingProgrammeStore.updated = false;
  }
})

const deleteRevision = () => {
  viewingProgrammeStore.deleteRevision();
}
</script>

<template>
  <NavIndicator :items="[
    { label: 'Programme', path: '/programme' },
    { label: viewingProgrammeStore.programme.name, path: `/programme/${viewingProgrammeStore.programme.code}` }
  ]" />

  <template v-if="viewingProgrammeStore.programme">
    <div class="card-plain px-4 text-muted-foreground text-sm flex flex-row justify-start items-center gap-2">
      {{ viewingProgrammeStore.programme.code }} {{ viewingProgrammeStore.programme.name }}
      <RevisionDropdown
        :current="viewingProgrammeStore.programme.revision"
        :options="viewingProgrammeStore.programmeRevisions.map(prog => prog.revision)"
        @selected="(rev) => viewingProgrammeStore.loadProgrammeRevision(rev)"
      />
      <div class="grow"></div>
      <RevisionDeleteButton @delete="deleteRevision" v-if="authStore.canEditProgrammes"/>
    </div>
    <ProgrammeSummary
      :editable="authStore.canEditProgrammes"
      :programme="viewingProgrammeStore.programme"
      :editing="editing"
      @update:editing="(ev) => updateEditing(ev, 'summary')"
    />
    <ProgrammePeo
      :editable="authStore.canEditProgrammes"
      :peoList="viewingProgrammeStore.programme.peoList"
      :editing="editing"
      @update:editing="(ev) => updateEditing(ev, 'peo')"
    />
    <ProgrammePo
      :editable="authStore.canEditProgrammes"
      :poList="viewingProgrammeStore.programme.poList"
      :editing="editing"
      @update:editing="(ev) => updateEditing(ev, 'po')"
    />
    <PoMapping
      :editable="authStore.canEditProgrammes"
      :poList="viewingProgrammeStore.programme.poList"
      :editing="editing"
      @update:editing="(ev) => updateEditing(ev, 'exambased')"
    />
    <ProgrammeStructure
      :editable="authStore.canEditProgrammes"
      :programme="viewingProgrammeStore.programme.code"
      :editing="editing"
      @update:editing="(ev) => updateEditing(ev, 'structure')"
    />
    <ProgrammeUpdateDialog v-model:isOpen="editing" />
  </template>
</template>
