<script setup lang="ts">
import { ref, computed } from 'vue';
import { getStructureLabelsByProgramme } from '@/utils/structureHelpers';
import ContentCard from '@/components/contentcard/ContentCard.vue';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getStructureByProgrammeAndLabel } from '@/utils/structureHelpers';
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table';

defineEmits(['update:editing']);

const props = defineProps<{
  programme: string;
  programmeRevision: string;
  editing: boolean;
}>();

const labels = computed(() => getStructureLabelsByProgramme(props.programme, props.programmeRevision));
const selectedStructureLabel = ref<string | null>(null);
const selectedStructure = computed(() => {
  if (!selectedStructureLabel.value) return null;
  return getStructureByProgrammeAndLabel(props.programme, props.programmeRevision, selectedStructureLabel.value);
});
const structureInSemesters = computed(() => {
  if (!selectedStructure.value) return [];
  let numberOfSemestersInAYear = 3;
  let arrangedStructure = [];
  for (let s = 0; s < numberOfSemestersInAYear; s++) {
    let semesterStructure = [];
    for (let i = s; i < selectedStructure.value.structure.length; i+=numberOfSemestersInAYear) {
      semesterStructure.push(selectedStructure.value.structure[i]);
    }
    arrangedStructure.push(semesterStructure);
  };
  return arrangedStructure;
});
</script>

<template>
  <ContentCard editable :editing="editing" @update:editing="$emit('update:editing', $event)">
    <template #title>
      Programme Structure
    </template>
    <template #body>
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
      <div v-if="selectedStructure">
        <div>{{ selectedStructure.structure }}</div>
        <div>{{ structureInSemesters }}</div>
        <Table>
          <TableHeader>
            <TableRow>
               <TableHead
                class="text-center"
                 v-for="_, index in Math.max(...structureInSemesters!.map(s => s.length))"
              >Year {{ index+1 }}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Course 1</TableCell>
              <TableCell>Course 2</TableCell>
              <TableCell>Course 3</TableCell>
              <TableCell>Course 4</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </template>
  </ContentCard>
</template>
