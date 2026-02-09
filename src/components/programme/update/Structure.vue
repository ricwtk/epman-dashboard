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

const onDragStart = (event: DragEvent, semIndex: number, courseIndex: number) => {
  event.dataTransfer!.setData('application/json', JSON.stringify({sem: semIndex, course: courseIndex}));
  event.dataTransfer!.effectAllowed = 'move';
};

const onDragEnd = (event: DragEvent) => {
  event.dataTransfer!.clearData();
};

const onDragOver = (event: DragEvent) => {
  event.preventDefault();
};

const onDrop = (event: DragEvent, semIndex: number, courseIndex: number, zone: string|null) => {
  console.log(event.dataTransfer!.getData('application/json'));
  console.log(`move to ${semIndex}, ${courseIndex}, ${zone}`)
};

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
      <Table v-if="structureDisplayMode === STRUCTURE_DISPLAY_MODES[0]">
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead
              class="text-center"
               v-for="_, yearIndex in structureBySemesters.info.numberOfYears"
            >Year {{ yearIndex+1 }}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="_, semIndex in structureBySemesters.info.numberOfSemestersPerYear"
            :key="semIndex"
          >
            <TableHead>Semester {{ semIndex + 1 }}</TableHead>
            <TableCell
              class="text-center align-top"
               v-for="semester, yearIndex in structureBySemesters.structure[semIndex]"
            >
              <Table>
                <TableBody>
                  <TableRow v-for="course in semester">
                    <TableCell>
                      <CourseListItem :code="course.code" :name="course.name" :credits="course.credits" />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Table v-else>
        <TableHeader>
          <TableRow>
            <TableHead
              class="text-center"
               v-for="_, semIndex in structureWithCourseInfo"
            >Semester {{ semIndex+1 }}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell
              class="text-center align-top"
               v-for="semester, semIndex in structureWithCourseInfo"
            >
              <Table>
                <TableBody>
                  <TableRow v-for="course, courseIndex in semester">
                    <TableCell>
                      <CourseListItem
                        :code="course.code"
                        :name="course.name"
                        :credits="course.credits"
                        @drag-start="(event: DragEvent) => onDragStart(event, semIndex, courseIndex)"
                        @item-drop="(event: DragEvent, zone: string|null) => onDrop(event, semIndex, courseIndex, zone)"
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </template>
  </div>
</template>
