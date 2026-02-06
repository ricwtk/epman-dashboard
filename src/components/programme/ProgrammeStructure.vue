<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import {
  getStructureByProgrammeAndLabel,
  getStructureLabelsByProgramme,
  convertStructureToTable,
  getCourseInfoInStructure
} from '@/utils/structureHelpers';
import ContentCard from '@/components/contentcard/ContentCard.vue';
import CourseListItem from '@/components/programme/CourseListItem.vue';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table';

defineEmits(['update:editing']);

const props = defineProps<{
  programme: string;
  programmeRevision: string;
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

const labels = computed(() => getStructureLabelsByProgramme(props.programme, props.programmeRevision));
const selectedStructureLabel = ref<string | null>(null);
const selectedStructure = computed(() => {
  if (!selectedStructureLabel.value) return null;
  return getStructureByProgrammeAndLabel(props.programme, props.programmeRevision, selectedStructureLabel.value);
});
const structureWithCourseInfo = computed(() => {
  if (!selectedStructure.value) return [];
  return getCourseInfoInStructure(selectedStructure.value.structure);
});
const structureInSemesters = computed(() => {
  if (!selectedStructure.value) return convertStructureToTable();
  return convertStructureToTable(structureWithCourseInfo.value);
});
</script>

<template>
  <ContentCard editable :editing="editing" @update:editing="$emit('update:editing', $event)">
    <template #title>
      Programme Structure
    </template>
    <template #body>
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
      <div v-if="selectedStructure">
        <Table v-if="structureDisplayMode === STRUCTURE_DISPLAY_MODES[0]">
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead
                class="text-center"
                 v-for="_, yearIndex in structureInSemesters.info.numberOfYears"
              >Year {{ yearIndex+1 }}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="_, semIndex in structureInSemesters.info.numberOfSemestersPerYear"
              :key="semIndex"
            >
              <TableHead>Semester {{ semIndex + 1 }}</TableHead>
              <TableCell
                class="text-center align-top"
                 v-for="semester, yearIndex in structureInSemesters.structure[semIndex]"
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
                 v-for="semester in structureWithCourseInfo"
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
      </div>
    </template>
  </ContentCard>
</template>
