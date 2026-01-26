<script setup lang="ts">
import { onMounted, ref, toRaw } from 'vue';
import { Badge } from '@/components/ui/badge';
import NavIndicator from '@/components/NavIndicator.vue';

import ProgrammeSummary from '@/components/programme/ProgrammeSummary.vue';
import ProgrammePo from '@/components/programme/ProgrammePo.vue';
import PoMapping from '@/components/programme/PoMapping.vue';
import ProgrammeUpdateDialog from '@/components/programme/ProgrammeUpdateDialog.vue';

import { useViewingProgrammeStore } from '@/stores/viewingprogramme';
const viewingProgrammeStore = useViewingProgrammeStore();

const props = defineProps<{ code: string }>();
onMounted(() => { viewingProgrammeStore.loadProgrammeByCode(props.code!); });

import { useEditingProgrammeStore } from "@/stores/editingprogramme";
const editingProgrammeStore = useEditingProgrammeStore();

const editing = ref(false);
const updateEditing = (ev: boolean, ) => {
  if (ev) {
    if (editingProgrammeStore.programme.code !== viewingProgrammeStore.programme.code) {
      editingProgrammeStore.loadProgramme(toRaw(viewingProgrammeStore.programme));
    }
  }
  editing.value = ev;
};
</script>

<template>
  <NavIndicator :items="[
    { label: 'Home', path: '/' },
    { label: 'Programme', path: '/programme' },
    { label: viewingProgrammeStore.programme.name, path: `/programme/${viewingProgrammeStore.programme.code}` }
  ]" />

  <template v-if="viewingProgrammeStore.programme">
    <div class="card-plain px-4 text-muted-foreground text-sm">
      {{ viewingProgrammeStore.programme.code }} {{ viewingProgrammeStore.programme.name }}
      <Badge>{{ viewingProgrammeStore.programme.revision }}</Badge>
    </div>
    <ProgrammeSummary :programme="viewingProgrammeStore.programme" :editing="editing" @update:editing="updateEditing" />
    <ProgrammePo :poList="viewingProgrammeStore.programme.poList" :editing="editing" @update:editing="updateEditing" />
    <PoMapping :poList="viewingProgrammeStore.programme.poList" :editing="editing" @update:editing="updateEditing" />
    <ProgrammeUpdateDialog v-model:isOpen="editing" />
  </template>
</template>
