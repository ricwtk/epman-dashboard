<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import ResetButton from '@/components/ResetButton.vue'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import CourseListItem from '../CourseListItem.vue';
import { getEditingProgrammeAndStore, getEditingStructureAndStore } from '@/composables/programme';
const { programme, editingProgrammeStore } = getEditingProgrammeAndStore();
const { structure, structureWithCourseInfo, structureBySemesters, editingStructureStore } = getEditingStructureAndStore();
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import StructureGrid from "@/components/programme/StructureGrid.vue"

const diffs = computed(() => {
  return false
})
const resetDiff = () => {
}

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
const labels = computed(() => editingProgrammeStore.structureLabels);
watch(selectedStructureLabel, (newLabel) => {
  if (newLabel) {
    editingStructureStore.loadStructure(programme.value.code, newLabel);
  }
});
</script>

<template>
  <div class="flex flex-col gap-1">
    <div class="flex flex-row justify-between">
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

      <Select v-model="structureDisplayMode">
        <SelectTrigger>
          <SelectValue placeholder="Select a display mode" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem v-for="label in STRUCTURE_DISPLAY_MODES" :value="label">{{ label }}</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
    <template v-if="selectedStructureLabel">
      <div class="font-semibold flex flex-row items-center gap-1 h-9">
        Structure label: {{ selectedStructureLabel }}
        <ResetButton v-if="diffs" @reset="resetDiff()" />
      </div>
      <div class="flex flex-col gap-1 grow">
        <Label for="label">Label</Label>
        <Input id="label" placeholder="Label for Programme Structure" v-model="structure.label"/>
      </div>

      <StructureGrid v-model="structure.structure" :editable="true"></StructureGrid>

    </template>
  </div>
</template>
