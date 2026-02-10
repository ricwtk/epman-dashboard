<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import {
  getStructureByProgrammeAndLabel,
  getStructureLabelsByProgramme
} from '@/utils/structureHelpers';
import ContentCard from '@/components/contentcard/ContentCard.vue';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import StructureGrid from '@/components/programme/StructureGrid.vue';

defineEmits(['update:editing']);

const props = defineProps<{
  programme: string;
  editing: boolean;
}>();

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

const labels = computed(() => getStructureLabelsByProgramme(props.programme));
const selectedStructureLabel = ref<string>("");
const selectedStructure = computed(() => {
  // if (!selectedStructureLabel.value) return { structure: [] };
  return getStructureByProgrammeAndLabel(props.programme, selectedStructureLabel.value);
});
</script>

<template>
  <ContentCard editable :editing="editing" @update:editing="$emit('update:editing', $event)">
    <template #title>
      Programme Structure
    </template>
    <template #body>
      <!-- <div class="flex flex-row justify-between">
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
      </div> -->

      <StructureGrid
        :editable="false"
        v-model="selectedStructure.structure"
      >
        <template #header>
          <!-- <div class="flex flex-row justify-between"> -->
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
          <!-- </div> -->
        </template>
      </StructureGrid>

    </template>
  </ContentCard>
</template>
