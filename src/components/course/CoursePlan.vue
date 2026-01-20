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

const props = defineProps<{ course: Course }>();

const getTotalHours = (hours: { online: number, f2f: number }) => (hours.online + hours.f2f);
const getTopicHours = (hours: Allocation) =>
  getTotalHours(hours.lecture)
  + getTotalHours(hours.tutorial)
  + getTotalHours(hours.practical)
  + getTotalHours(hours.assessment)
  + getTotalHours(hours.others)
  + getTotalHours(hours.self);
const getTotalComponentHours = (component: keyof Allocation) => {
  const total = props.course.weeklyPlan.reduce((acc, topic) => {
    return acc + getTotalHours(topic.hours[component]);
  }, 0);
  return total;
};
const totalSLT = computed(() => {
  const total = props.course.weeklyPlan.reduce((acc, topic) => {
    return acc + getTopicHours(topic.hours);
  }, 0);
  return total;
});
const creditHours = computed(() => {
  return totalSLT.value / 40;
});
</script>

<template>
  <ContentCard editable>
    <template #title>
      Teaching Plan
    </template>
    <template #body>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead rowspan="2" class="font-bold">Topics</TableHead>
            <TableHead colspan="6" class="font-bold text-center">Student Learning Time (SLT)</TableHead>
            <TableHead rowspan="2" class="font-bold text-center">Topic SLT</TableHead>
          </TableRow>
          <TableRow>
            <TableHead class="font-bold text-center">L</TableHead>
            <TableHead class="font-bold text-center">T</TableHead>
            <TableHead class="font-bold text-center">P</TableHead>
            <TableHead class="font-bold text-center">A</TableHead>
            <TableHead class="font-bold text-center">O</TableHead>
            <TableHead class="font-bold text-center">IL</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="plan in course.weeklyPlan">
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
            <TableCell class="font-bold">Sub-total for each SLT components</TableCell>
            <TableCell class="text-center">{{ getTotalComponentHours("lecture") }}</TableCell>
            <TableCell class="text-center">{{ getTotalComponentHours("tutorial") }}</TableCell>
            <TableCell class="text-center">{{ getTotalComponentHours("practical") }}</TableCell>
            <TableCell class="text-center">{{ getTotalComponentHours("assessment") }}</TableCell>
            <TableCell class="text-center">{{ getTotalComponentHours("others") }}</TableCell>
            <TableCell class="text-center">{{ getTotalComponentHours("self") }}</TableCell>
            <TableCell class="text-center">{{ totalSLT }}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell class="font-bold">Total SLT Hours</TableCell>
            <TableCell colspan="7" class="text-center">{{ totalSLT }}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell class="font-bold">SLT Credit Hours</TableCell>
            <TableCell colspan="7" class="text-center">{{ creditHours }}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </template>
  </ContentCard>
</template>
