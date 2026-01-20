<script setup lang="ts">
import { type Assessment } from '@/lib/course';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '@/components/ui/table';
import { CheckIcon, CornerDownRightIcon } from 'lucide-vue-next';

const props = defineProps<{
  assessments: Assessment[] | undefined;
  coCount: number;
}>();
</script>

<template>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead class="font-bold">Method</TableHead>
        <TableHead class="font-bold text-center">Weightage</TableHead>
        <TableHead class="font-bold text-center" v-for="index in coCount" :key="index">CO{{ index }}</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <template v-for="(assessment, assessmentIndex) in assessments" :key="assessmentIndex">

        <TableRow>
          <TableCell>{{ assessment.description }}</TableCell>
          <TableCell class="text-center">{{ assessment.breakdown.length > 0 ? '' : `${assessment.weightage} %` }}</TableCell>
          <TableCell class="text-center"
            v-for="coIndex in coCount"
            :key="coIndex"
          >
            <template v-if="!(assessment.breakdown.length > 0)">
              <CheckIcon class="inline-block" :size="16" v-if="assessment.cos.includes(coIndex)"></CheckIcon>
            </template>
          </TableCell>
        </TableRow>

        <template v-if="assessment.breakdown.length > 0">
          <TableRow v-for="(item, itemIndex) in assessment.breakdown" :key="itemIndex">
            <TableCell class="flex flex-row items-center">
              <CornerDownRightIcon class="inline-block" :size="16" />
              <div class="inline-block ml-1">{{ item.description }}</div>
            </TableCell>
            <TableCell class="text-center">{{ item.weightage }}%</TableCell>
            <TableCell class="text-center"
              v-for="coIndex in coCount"
              :key="coIndex"
            >
              <CheckIcon class="inline-block" :size="16" v-if="item.co == coIndex"></CheckIcon>
            </TableCell>
          </TableRow>
        </template>

      </template>
    </TableBody>
  </Table>
</template>
