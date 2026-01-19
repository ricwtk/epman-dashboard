<script setup lang="ts">
import ContentCard from '@/components/contentcard/ContentCard.vue';
import { type Assessment } from '@/lib/course'
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
import { computed } from 'vue';

const props = defineProps<{
  assessments: Assessment[] | undefined;
  coCount: number;
}>();

interface AssessmentWithBreakdownVisibility extends Assessment {
  showbreakdown: boolean;
}

const assessmentsByComponent = computed(() => {
  if (!props.assessments) return [];
  const grouped = props.assessments.reduce((acc, assessment) => {
    if (!acc[assessment.component]) acc[assessment.component] = [];
    acc[assessment.component]!.push({ ...assessment, showbreakdown: false });
    return acc;
  }, {} as Record<string, AssessmentWithBreakdownVisibility[]>);
  return Object.entries(grouped).map(([component, assessments]) => ({
    component,
    assessments
  }));
});
</script>

<template>
  <ContentCard editable>
    <template #title>
      Assessments
    </template>
    <template #body>
      <div v-if="assessments">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead class="font-bold">Component</TableHead>
              <TableHead class="font-bold">Method</TableHead>
              <TableHead class="font-bold text-center">Weightage</TableHead>
              <TableHead class="font-bold text-center" v-for="index in coCount" :key="index">CO{{ index }}</TableHead>
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
      </div>
    </template>
  </ContentCard>
</template>
