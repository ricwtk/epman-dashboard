<script setup lang="ts">
import { computed } from 'vue';
import ContentCard from '@/components/contentcard/ContentCard.vue';
import { type Allocation, type Course } from '@/lib/course';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from '@/components/ui/table';

const props = defineProps<{ course: Course; editing: boolean }>();
defineEmits(['update:editing']);

import {
  getTotalHours,
  getTopicHours,
  getTotalComponentHours,
  getTotalHoursForCourse,
  getCreditHours
} from '@/lib/course';

const totalSLT = computed(() => getTotalHoursForCourse(props.course.teachingPlan))
const creditHours = computed(() => getCreditHours(totalSLT.value))
</script>

<template>
  <ContentCard editable :editing="editing" @update:editing="$emit('update:editing', $event)">
    <template #title>
      Teaching Plan
    </template>
    <template #body>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead rowspan="2" class="">Topics</TableHead>
            <TableHead colspan="6" class="text-center">Student Learning Time (SLT)</TableHead>
            <TableHead rowspan="2" class="text-center">Topic SLT</TableHead>
          </TableRow>
          <TableRow>
            <TableHead class="text-center">L</TableHead>
            <TableHead class="text-center">T</TableHead>
            <TableHead class="text-center">P</TableHead>
            <TableHead class="text-center">A</TableHead>
            <TableHead class="text-center">O</TableHead>
            <TableHead class="text-center">IL</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="plan in course.teachingPlan">
            <TableCell>{{ plan.description }}</TableCell>
            <TableCell class="text-center">{{ getTotalHours(plan.hours.lecture) }}</TableCell>
            <TableCell class="text-center">{{ getTotalHours(plan.hours.tutorial) }}</TableCell>
            <TableCell class="text-center">{{ getTotalHours(plan.hours.practical) }}</TableCell>
            <TableCell class="text-center">{{ getTotalHours(plan.hours.assessment) }}</TableCell>
            <TableCell class="text-center">{{ getTotalHours(plan.hours.others) }}</TableCell>
            <TableCell class="text-center">{{ getTotalHours(plan.hours.self) }}</TableCell>
            <TableCell class="text-center">{{ getTopicHours(plan.hours) }}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell class="font-medium">Sub-total for each SLT components</TableCell>
            <TableCell class="font-medium text-center">{{ getTotalComponentHours(course.teachingPlan, "lecture") }}</TableCell>
            <TableCell class="font-medium text-center">{{ getTotalComponentHours(course.teachingPlan, "tutorial") }}</TableCell>
            <TableCell class="font-medium text-center">{{ getTotalComponentHours(course.teachingPlan, "practical") }}</TableCell>
            <TableCell class="font-medium text-center">{{ getTotalComponentHours(course.teachingPlan, "assessment") }}</TableCell>
            <TableCell class="font-medium text-center">{{ getTotalComponentHours(course.teachingPlan, "others") }}</TableCell>
            <TableCell class="font-medium text-center">{{ getTotalComponentHours(course.teachingPlan, "self") }}</TableCell>
            <TableCell class="font-medium text-center">{{ totalSLT }}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell class="font-semibold">Total SLT Hours</TableCell>
            <TableCell colspan="7" class="font-semibold text-center">{{ totalSLT }}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell class="font-semibold">SLT Credit Hours</TableCell>
            <TableCell colspan="7" class="font-semibold text-center">{{ creditHours }}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </template>
  </ContentCard>
</template>
