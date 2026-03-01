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
// const structureArray = defineModel<string[][]>({ default: [[]] })
// const structureArrayWithCourseInfo = computed(() => getCourseInfoInStructure(structureArray.value))
const structureObject = ref<{ [semesterKey: string]: string[] }>({});
const structureObjectWithCourseInfo = computed(() => getCourseInfoInStructure(structureObject.value))
const semesterKeys = computed(() => Object.keys(structureObject.value).sort())

const col_n = computed(() =>
  structureDisplayMode.value ?
    structureDisplayMode.value == "by year" ?
      Math.ceil(semesterKeys.value.length / NUMBER_OF_SEMESTER_PER_YEAR)
      : semesterKeys.value.length
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
const sem_keys = computed(() => {
  if (!structureDisplayMode.value) return []
  else {
    let all_sem = []
    for (let r = 0; r < row_n.value; r++) {
      let one_row = []
      for (let c = 0; c < col_n.value; c++) {
        const idx = c * row_n.value + r
        one_row.push(semesterKeys.value[idx] ?? '')
      }
      all_sem.push(one_row)
    }
    return all_sem
  }
})

const onDragStart = (event: DragEvent, semKey: string, courseIndex: number) => {
  event.dataTransfer!.setData('application/json', JSON.stringify({sem: semKey, course: courseIndex}));
  event.dataTransfer!.effectAllowed = 'move';
};

const onDragEnd = (event: DragEvent) => {
  event.dataTransfer!.clearData();
};

const onDragOver = (event: DragEvent) => {
  event.preventDefault();
};

const onDrop = (event: DragEvent, semKey: string, courseIndex: number, zone: string|null) => {
  const originalPosition = JSON.parse(event.dataTransfer!.getData('application/json'))
  const newPosition = { sem: semKey, course: courseIndex, place: zone}

  // 1. Remove item
  const [item] = structureObject.value[originalPosition.sem]!.splice(originalPosition.course, 1)

  // 2. Fix indices if removal affects destination
  if (originalPosition.sem === newPosition.sem
    && originalPosition.course < newPosition.course) {
    newPosition.course -= 1
  }
  if (newPosition.place === 'bottom') { newPosition.course += 1 }

  // Clamp column index
  newPosition.course = Math.max(0, Math.min(newPosition.course, structureObject.value[newPosition.sem]!.length))

  // 3. Insert item
  structureObject.value[newPosition.sem]!.splice(newPosition.course, 0, item || "")
};

/*
* Add course to semester parameters and functions
*/
const bannedList = computed(() => {
  return []
});
const availableList = computed(() => {
  return []
});
const errorMessageFcn = (name: string, code: string, bannedItem?: { name: string, code: string }) => {
  return `Course ${name} (${code}) already exists`
};
const addCourse = (code: string) => {}
const createCourse = (name:string, code: string) => {}
// ----------

import { zeroPad } from '@/utils/common';
const addSemester = (asSemNumber = -1) => {
  if (asSemNumber <= 0) {
    const newSemesterKey = `Semester ${zeroPad(semesterKeys.value.length + 1)}`
    structureObject.value[newSemesterKey] = []
  } else {
    if (asSemNumber <= semesterKeys.value.length) {
      for (let i = semesterKeys.value.length; i >= asSemNumber; i--) {
        const newSemesterKey = `Semester ${zeroPad(i + 1)}`
        const oldSemesterKey = `Semester ${zeroPad(i)}`
        structureObject.value[newSemesterKey] = structureObject.value[oldSemesterKey] || []
        delete structureObject.value[oldSemesterKey]
      }
    }
    const newSemesterKey = `Semester ${zeroPad(asSemNumber)}`
    structureObject.value[newSemesterKey] = []
  }
};

import {
  Table,
  TableBody,
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
import { Button } from '@/components/ui/button';
import { PlusIcon, XIcon, PenIcon } from 'lucide-vue-next'
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem } from '@/components/ui/context-menu'
import AddCoursePopover from './update/AddCoursePopover.vue';
import NewOrAddPopover from '../NewOrAddPopover.vue';
</script>

<template>
  <div class="flex flex-col gap-1">
    <div class="flex flex-row justify-between gap-1 items-end">
      <slot name="header"></slot>
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
    <Table v-if="structureObject && semesterKeys.length > 0">
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
        <TableRow v-for="row, row_index in sem_keys">
          <TableHead v-if="row_header!==''" class="w-0">{{ `${row_header} ${row_index+1}` }}</TableHead>
          <TableCell v-for="sem_key, col_index in row"
            class="text-center align-top"
          >
            <Table>
              <TableBody>
                <TableRow v-for="course, course_index in structureObjectWithCourseInfo[sem_key!]">
                  <TableCell class="py-0 min-w-50">
                    <ContextMenu>
                      <ContextMenuTrigger>
                        <CourseListItem
                          :draggable="editable"
                          :code="course.code"
                          :name="course.name"
                          :credits="course.credits"
                          @drag-start="(event: DragEvent) => onDragStart(event, sem_key, course_index)"
                          @item-drop="(event: DragEvent, zone: string|null) => onDrop(event, sem_key, course_index, zone)"
                        />
                      </ContextMenuTrigger>
                      <ContextMenuContent class="w-fit">
                        <ContextMenuItem>
                          <XIcon />
                          Delete
                        </ContextMenuItem>
                        <ContextMenuItem>
                          <PenIcon />
                          Edit
                        </ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>

                  </TableCell>
                </TableRow>
                <TableRow v-if="editable">
                  <TableCell>
                    <AddCoursePopover
                      :structure="structureObject"
                    />
                    <NewOrAddPopover
                      :bannedList="bannedList"
                      :availableList="availableList"
                      title="Add Course"
                      description="Add course to semester"
                      :errorMessageFcn="errorMessageFcn"
                      @create="createCourse"
                      @add="addCourse"
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <Button v-else
      v-if="editable"
      variant="secondary"
      @click="addSemester"
    >Add Semester</Button>
  </div>
</template>
