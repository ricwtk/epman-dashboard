<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import ResetButton from '@/components/ResetButton.vue'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getEditingProgrammeAndStore, getEditingStructureAndStore } from '@/composables/programme';
const { programme, editingProgrammeStore } = getEditingProgrammeAndStore();
const { structure, editingStructureStore } = getEditingStructureAndStore();
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import StructureGrid from "@/components/programme/StructureGrid.vue"
import CreateLabelPopover from '@/components/CreateLabelPopover.vue';
import { ButtonGroup } from '@/components/ui/button-group';
import { formatRevision } from '@/utils/common';
import { createNewStructure } from '@/utils/structureHelpers';

import { dataService } from '@/services/dataService';
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();

const diffs = computed(() => {
  return editingStructureStore.checkDiff()
})
// const diffContent = computed(() => editingStructureStore.getDiff())
const resetDiff = () => editingStructureStore.resetDiff()

const structureDisplayMode = ref<string | null>(null);
const STRUCTURE_DISPLAY_MODES = ['by year', 'by semester'];
onMounted(() => {
  let currentDisplayMode = localStorage.getItem('structureDisplayMode');
  if (currentDisplayMode) {
    structureDisplayMode.value = currentDisplayMode;
  } else {
    structureDisplayMode.value = STRUCTURE_DISPLAY_MODES[0] || null;
  }
});
watch(structureDisplayMode, (newMode) => {
  localStorage.setItem('structureDisplayMode', newMode || "");
});

const selectedStructureLabel = ref<string | null>(null);
const labels = computed(() => editingProgrammeStore.structures?.map((structure) => structure.label) || []);
watch(selectedStructureLabel, (newLabel) => {
  if (newLabel) {
    editingStructureStore.loadStructure(programme.value.code, newLabel);
  }
});
const addNewStructure = async (newLabel: string) => {
  const newStructureParameters = {
    programme: programme.value.code,
    label: newLabel,
    revision: formatRevision(),
    committed: {
      on: new Date(),
      by: authStore.user?.email || 'unknown'
    }
  }
  const newStructure = createNewStructure(newStructureParameters);
  try {
    await dataService.saveStructure(newStructure);
    // await updateProgrammeList();
  } catch (error) {
    console.error('Error saving structure:', error);
  }
  // editingStructureStore.createStructure(programme.value.code, newLabel);
};
</script>

<template>
  <div class="flex flex-col gap-1">
    <div class="flex flex-row justify-start gap-2">
      <ButtonGroup>
        <Select v-model="selectedStructureLabel">
          <SelectTrigger>
            <SelectValue placeholder="Select a structure" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem v-for="label in labels" :value="label">{{ label }}</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <CreateLabelPopover :currentList="labels" @create="addNewStructure">
          <template #title>New Structure</template>
          <template #description>Create new structure</template>
        </CreateLabelPopover>
      </ButtonGroup>
    </div>
    <template v-if="selectedStructureLabel">
      <div class="font-semibold flex flex-row items-center gap-1 h-9">
        Structure label: {{ selectedStructureLabel }}
        <ResetButton :disabled="!diffs" @reset="resetDiff" />
      </div>

      <StructureGrid v-model="structure.structure" :editable="true">
        <template #header>
          <div class="flex flex-col gap-1 grow">
            <Label for="label">Label</Label>
            <Input id="label" placeholder="Label for Programme Structure" v-model="structure.label"/>
          </div>
        </template>
      </StructureGrid>

    </template>
  </div>
</template>
