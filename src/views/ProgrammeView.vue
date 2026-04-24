<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
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

import { useProgrammeStore } from '@/stores/programme';
const programmeStore = useProgrammeStore();

import { useStructureListStore } from '@/stores/structurelist';
const structureListStore = useStructureListStore();

import { useStructureStore } from '@/stores/structure';
const structureStore = useStructureStore();

const props = defineProps<{ code: string }>();
onMounted(() => {
  programmeStore.loadProgrammeByCode(props.code);
  console.log(programmeStore.revisions)
  structureListStore.updateLabelToInfoMap(props.code)
  structureStore.programmeCode = props.code
});

const loading = computed(() => programmeStore.loading || structureStore.loading);

const editing = ref(false);
const updateEditing = (ev: boolean, tab?: string) => {
  if (ev) {
    if (programmeStore.draft.code !== programmeStore.saved.code) {
      programmeStore.createDraft();
    }
    programmeStore.editingTab = tab || 'summary';
  }
  editing.value = ev;
};
</script>

<template>
  <NavIndicator :items="[
    { label: 'Programme', path: '/programme' },
    { label: programmeStore.saved.name, path: `/programme/${programmeStore.saved.code}` }
  ]" />

  <template v-if="programmeStore.saved">
    <div class="card-plain px-4 text-muted-foreground text-sm flex flex-row justify-start items-center gap-2">
      {{ programmeStore.saved.code }} {{ programmeStore.saved.name }}
      <RevisionDropdown
        :current="programmeStore.saved.revision"
        :options="programmeStore.revisions.map(prog => prog.revision)"
        @selected="(rev) => programmeStore.loadRevision(rev)"
      />
      <div class="grow"></div>
      <RevisionDeleteButton @delete="programmeStore.deleteRevision()" v-if="authStore.canEditProgrammes"/>
    </div>
    <ProgrammeSummary
      :editable="authStore.canEditProgrammes"
    />
    <!-- <ProgrammeSummary
      :loading="loading"
      :editable="authStore.canEditProgrammes"
      :programme="programmeStore.saved"
      :editing="editing"
      @update:editing="(ev) => updateEditing(ev, 'summary')"
    /> -->
    <ProgrammePeo
      :editable="authStore.canEditProgrammes"
    />
    <!-- <ProgrammePeo
      :loading="loading"
      :editable="authStore.canEditProgrammes"
      :peoList="programmeStore.saved.peoList"
      :editing="editing"
      @update:editing="(ev) => updateEditing(ev, 'peo')"
    /> -->
    <ProgrammePo
      :loading="loading"
      :editable="authStore.canEditProgrammes"
      :poList="programmeStore.saved.poList"
      :editing="editing"
      @update:editing="(ev) => updateEditing(ev, 'po')"
    />
    <PoMapping
      :loading="loading"
      :editable="authStore.canEditProgrammes"
      :poList="programmeStore.saved.poList"
      :editing="editing"
      @editMapping="(courseType) => updateEditing(true, courseType)"
    />
    <ProgrammeStructure
      :loading="loading"
      :editable="authStore.canEditProgrammes"
      :structureList="structureListStore.labelToInfoMap"
      :editing="editing"
      @update:editing="(ev) => updateEditing(ev, 'structure')"
    />
    <ProgrammeUpdateDialog v-model:isOpen="editing" />
  </template>
</template>
