<script setup lang="ts">
import { type Assessment } from '@/types/course'
import { computed } from 'vue';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { CheckIcon, EyeIcon, EyeOffIcon } from 'lucide-vue-next';

const props = defineProps<{
  assessments: Assessment[] | undefined,
  coCount: number;
}>()

const assessmentsByComponent = computed(() => {
  if (!props.assessments) return [];
  const grouped = props.assessments.reduce((acc, assessment) => {
    if (!acc[assessment.component]) acc[assessment.component] = [];
    acc[assessment.component]!.push(assessment);
    return acc;
  }, {} as Record<string, Assessment[]>);
  return Object.entries(grouped).map(([component, assessments]) => ({
    component,
    assessments
  }));
});
</script>

<template>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead class="">Component</TableHead>
        <TableHead class="">Method</TableHead>
        <TableHead class="text-center">Weightage</TableHead>
        <TableHead class="text-center" v-for="index in coCount" :key="index">CO{{ index }}</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <template v-for="componentgroup in assessmentsByComponent" :key="componentgroup.component">
        <TableRow v-for="(assessment, index) in componentgroup.assessments" :key="index">
          <TableCell :rowspan="componentgroup.assessments.length" v-if="index==0">{{ assessment.component }}</TableCell>
          <TableCell>
            {{ assessment.description }}
          </TableCell>
          <TableCell class="text-center">{{ assessment.weightage }}</TableCell>
          <TableCell class="text-center"
            v-for="index in coCount"
            :key="index"
          >
            <CheckIcon class="inline-block" :size="16" v-if="assessment.cos.includes(index)"></CheckIcon>
          </TableCell>
        </TableRow>
      </template>
    </TableBody>
  </Table>
</template>
