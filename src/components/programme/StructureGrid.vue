<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue';

defineProps<{
  editable: boolean
}>();

import { STRUCTURE_DISPLAY_MODES, NUMBER_OF_SEMESTER_PER_YEAR } from '@/constants'
const structureDisplayMode = ref<string | null>(null)
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

import { getCourseInfoInStructure } from "@/utils/structureHelpers"
const structureArray = defineModel<string[][]>({ default: [[]] })
const structureArrayWithCourseInfo = computed(() => getCourseInfoInStructure(structureArray.value))

const col_n = computed(() =>
  structureDisplayMode.value ?
    structureDisplayMode.value == "by year" ?
      Math.ceil(structureArray.value.length / NUMBER_OF_SEMESTER_PER_YEAR)
      : structureArray.value.length
    : 0
)
const row_n = computed(() =>
  structureDisplayMode.value ?
    structureDisplayMode.value == "by year" ?
      NUMBER_OF_SEMESTER_PER_YEAR
      : 1
    : 0
)
const col_header = computed(() =>
  structureDisplayMode.value ?
    structureDisplayMode.value == "by year" ?
      "Year"
      : "Semester"
    : ""
)
const row_header = computed(() =>
  structureDisplayMode.value ?
    structureDisplayMode.value == "by year" ?
      "Semester"
      : ""
    : ""
)
const sem_indices = computed(() => {
  if (!structureDisplayMode.value) return []
  else {
    let all_sem = []
    for (let r = 0; r < row_n.value; r++) {
      let one_row = []
      for (let c = 0; c < col_n.value; c++) {
        one_row.push(c * row_n.value + r)
      }
      all_sem.push(one_row)
    }
    return all_sem
  }
})

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

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import CourseListItem from '@/components/programme/CourseListItem.vue';
</script>

<template>
  <div class="flex flex-col gap-1">
    <div class="flex flex-row justify-end">
      <Select v-model="structureDisplayMode">
        <SelectTrigger>
          <SelectValue placeholder="Select a display mode" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem
              v-for="label in STRUCTURE_DISPLAY_MODES"
              :value="label"
            >{{ label }}</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
    {{ col_n }}{{ row_n }} {{ sem_indices }}
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead v-if="row_header!==''"></TableHead>
          <TableHead v-for="_, col_index in col_n"
            class="text-center"
          >
            {{ `${col_header} ${col_index+1}` }}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="row, row_index in sem_indices">
          <TableHead v-if="row_header!==''">{{ `${row_header} ${row_index+1}` }}</TableHead>
          <TableCell v-for="sem_index, col_index in row"
            class="text-center align-top"
          >
            <Table>
              <TableBody>
                <TableRow v-for="course, course_index in structureArrayWithCourseInfo[sem_index]">
                  <TableCell class="py-0">
                    <CourseListItem
                      :draggable="editable"
                      :code="course.code"
                      :name="course.name"
                      :credits="course.credits"
                      @drag-start="(event: DragEvent) => onDragStart(event, sem_index, course_index)"
                      @item-drop="(event: DragEvent, zone: string|null) => onDrop(event, sem_index, course_index, zone)"
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
