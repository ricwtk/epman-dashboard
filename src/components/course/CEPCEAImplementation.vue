<script setup lang="ts">
import { type Course } from '@/lib/course';
import ContentCard from '@/components/contentcard/ContentCard.vue';
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@/components/ui/table';
import BadgeList from '@/components/BadgeList.vue';
import { CheckIcon, MinusIcon } from 'lucide-vue-next';
import { type Assessment } from '@/lib/course';

defineProps<{ course: Course }>();

const getCEPCEA = (assessment: Assessment, coIndex: number) => {
  const descriptors: string[] = [];
  if (assessment.breakdown.length > 0) {
    for (const item of assessment.breakdown) {
      if (item.co === coIndex) {
        if (item.wps && item.wps.length > 0) {
          descriptors.push(...item.wps.map(wp => `WP${wp}`));
        }
        if (item.eas && item.eas.length > 0) {
          descriptors.push(...item.eas.map(ea => `EA${ea}`));
        }
      }
    }
  } else {
    if (assessment.cos.includes(coIndex)) {
      if (assessment.wps && assessment.wps.length > 0) {
        descriptors.push(...assessment.wps.map(wp => `WP${wp}`));
      }
      if (assessment.eas && assessment.eas.length > 0) {
        descriptors.push(...assessment.eas.map(ea => `EA${ea}`));
      }
    }
  }
  return descriptors.map(d => d);
};

const getWeightage = (assessment: Assessment, coIndex: number) => {
  let weightage = 0;
  if (assessment.breakdown.length > 0) {
    for (const item of assessment.breakdown) {
      if (item.co === coIndex) {
        weightage += item.weightage;
      }
    }
  } else {
    if (assessment.cos.includes(coIndex)) {
      weightage += assessment.weightage / assessment.cos.length;
    }
  }
  return Math.round(weightage);
};

</script>

<template>
  <ContentCard editable>
    <template #title>
      CEP and CEA Implementation
    </template>
    <template #body>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead class="font-bold text-center" rowspan="2">CO</TableHead>
            <TableHead class="font-bold text-center" rowspan="2">PO</TableHead>
            <TableHead class="font-bold text-center" rowspan="2">WA</TableHead>
            <TableHead class="font-bold text-center" rowspan="2">WK</TableHead>
            <TableHead class="font-bold text-center" rowspan="2">WP</TableHead>
            <TableHead class="font-bold text-center" rowspan="2">EA</TableHead>
            <TableHead class="font-bold text-center" rowspan="2">SDG</TableHead>
            <TableHead :colspan="course.assessments.length * 2" class="font-bold text-center">
              Assessment (Weightage %)
            </TableHead>
          </TableRow>
          <TableRow>
            <template v-for="assessment in course.assessments">
              <TableHead class="font-bold text-center">{{ assessment.description }}<br />({{ assessment.weightage }}%)</TableHead>
              <TableHead class="font-bold text-center">CEP/CEA Descriptors</TableHead>
            </template>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="(co, index) in course.cos" :key="index">
            <TableCell class="text-center">CO{{ index + 1 }}</TableCell>
            <TableCell class="text-center">
              <BadgeList :items="co.pos.map((po) => 'PO'+po)" />
            </TableCell>
            <TableCell class="text-center">
              <BadgeList :items="co.was.map((wa) => 'WA'+wa)" />
            </TableCell>
            <TableCell class="text-center">
              <BadgeList :items="co.wks.map((wk) => 'WK'+wk)" />
            </TableCell>
            <TableCell class="text-center">
              <BadgeList :items="co.wps.map((wp) => 'WP'+wp)" />
            </TableCell>
            <TableCell class="text-center">
              <BadgeList :items="co.eas.map((ea) => 'EA'+ea)" />
            </TableCell>
            <TableCell class="text-center">
              <CheckIcon class="inline-block" :size="16" v-if="co.sdg" />
              <MinusIcon class="inline-block" :size="16" v-else />
            </TableCell>
            <template v-for="assessment in course.assessments">
              <TableCell class="font-bold text-center">
                <template v-if="assessment.cos.includes(index + 1)">
                  <CheckIcon class="inline-block" :size="16" />
                  <br/>
                  {{ getWeightage(assessment, index+1) }}%
                </template>
                <template v-else>
                  <MinusIcon class="inline-block" :size="16" />
                </template>
              </TableCell>
              <TableCell class="font-bold text-center">
                <BadgeList :items="getCEPCEA(assessment, index+1)" />
              </TableCell>
            </template>
          </TableRow>
        </TableBody>
      </Table>
    </template>
  </ContentCard>
</template>
