<script setup lang="ts">
import { computed } from 'vue';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { type Plan, type Allocation } from "@/lib/course"

import { PlusIcon, MinusIcon, ChevronUpIcon, ChevronDownIcon } from 'lucide-vue-next';

const teachingPlan: Plan[] = [
  {
    description: "Programming fundamentals and variables",
    hours: { lecture: { online: 1, f2f: 2 }, practical: { online: 0, f2f: 0 }, tutorial: { online: 0, f2f: 0 }, self: { online: 0, f2f: 0 }, others: { online: 0, f2f: 0 }, assessment: { online: 0, f2f: 0 } }
  }
]

const getTotalHours = (hours: { online: number, f2f: number }) => (hours.online + hours.f2f);
const getTopicHours = (hours: Allocation) =>
  getTotalHours(hours.lecture)
  + getTotalHours(hours.tutorial)
  + getTotalHours(hours.practical)
  + getTotalHours(hours.assessment)
  + getTotalHours(hours.others)
  + getTotalHours(hours.self);
const getTotalComponentHours = (component: keyof Allocation) => {
  const total = teachingPlan.reduce((acc, topic) => {
    return acc + getTotalHours(topic.hours[component]);
  }, 0);
  return total;
};
const getTotalComponentOnlineHours = (component: keyof Allocation) => {
  const total = teachingPlan.reduce((acc, topic) => {
    return acc + topic.hours[component].online;
  }, 0);
  return total;
};
const getTotalComponentF2FHours = (component: keyof Allocation) => {
  const total = teachingPlan.reduce((acc, topic) => {
    return acc + topic.hours[component].f2f;
  }, 0);
  return total;
};
const totalSLT = computed(() => {
  const total = teachingPlan.reduce((acc, topic) => {
    return acc + getTopicHours(topic.hours);
  }, 0);
  return total;
});
const creditHours = computed(() => {
  return totalSLT.value / 40;
});
</script>

<template>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead class="w-0" rowspan="3"></TableHead>
        <TableHead rowspan="3">Topic</TableHead>
        <TableHead class="w-0" rowspan="3"></TableHead>
        <TableHead colspan="12">Student Learning Time (SLT)</TableHead>
        <TableHead rowspan="3" class="w-0">Topic SLT</TableHead>
      </TableRow>
      <TableRow>
        <TableHead colspan="2">L</TableHead>
        <TableHead colspan="2">T</TableHead>
        <TableHead colspan="2">P</TableHead>
        <TableHead colspan="2">A</TableHead>
        <TableHead colspan="2">O</TableHead>
        <TableHead colspan="2">IL</TableHead>
      </TableRow>
      <TableRow>
        <template v-for="_ in 6">
          <TableHead class="w-0 text-center">Onl</TableHead>
          <TableHead class="w-0 text-center">F2F</TableHead>
        </template>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="(plan, planIndex) in teachingPlan">
        <TableCell class="w-0">
          <Button variant="destructive" size="icon"><MinusIcon /></Button>
        </TableCell>
        <TableCell class="text-center">
          <Textarea v-model="plan.description" class="min-w-60 w-full"/>
        </TableCell>
        <TableCell class="w-0">
          <div class="flex flex-col">
            <Button variant="secondary" :disabled="planIndex === 0"><ChevronUpIcon /></Button>
            <Button variant="secondary" :disabled="planIndex === teachingPlan.length - 1"><ChevronDownIcon /></Button>
          </div>
        </TableCell>
        <TableCell class="text-center">
          <Input v-model="plan.hours.lecture.online" type="number" class="w-16"/>
        </TableCell>
        <TableCell class="text-center">
          <Input v-model="plan.hours.lecture.f2f" type="number" class="w-16"/>
        </TableCell>
        <TableCell class="text-center">
          <Input v-model="plan.hours.tutorial.online" type="number" class="w-16"/>
        </TableCell>
        <TableCell class="text-center">
          <Input v-model="plan.hours.tutorial.f2f" type="number" class="w-16"/>
        </TableCell>
        <TableCell class="text-center">
          <Input v-model="plan.hours.practical.online" type="number" class="w-16"/>
        </TableCell>
        <TableCell class="text-center">
          <Input v-model="plan.hours.practical.f2f" type="number" class="w-16"/>
        </TableCell>
        <TableCell class="text-center">
          <Input v-model="plan.hours.assessment.online" type="number" class="w-16"/>
        </TableCell>
        <TableCell class="text-center">
          <Input v-model="plan.hours.assessment.f2f" type="number" class="w-16"/>
        </TableCell>
        <TableCell class="text-center">
          <Input v-model="plan.hours.others.online" type="number" class="w-16"/>
        </TableCell>
        <TableCell class="text-center">
          <Input v-model="plan.hours.others.f2f" type="number" class="w-16"/>
        </TableCell>
        <TableCell class="text-center">
          <Input v-model="plan.hours.self.online" type="number" class="w-16"/>
        </TableCell>
        <TableCell class="text-center">
          <Input v-model="plan.hours.self.f2f" type="number" class="w-16" />
        </TableCell>
        <TableCell class="text-center">{{ getTopicHours(plan.hours) }}</TableCell>
      </TableRow>

      <TableRow>
        <TableCell></TableCell>
        <TableCell colspan="2">
          <Button variant="default" class="w-full"><PlusIcon /></Button>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell></TableCell>
        <TableCell class="font-medium">Sub-total for each SLT components</TableCell>
        <TableCell></TableCell>
        <TableCell class="font-medium text-center">{{ getTotalComponentOnlineHours("lecture") }}</TableCell>
        <TableCell class="font-medium text-center">{{ getTotalComponentF2FHours("lecture") }}</TableCell>
        <TableCell class="font-medium text-center">{{ getTotalComponentOnlineHours("tutorial") }}</TableCell>
        <TableCell class="font-medium text-center">{{ getTotalComponentF2FHours("tutorial") }}</TableCell>
        <TableCell class="font-medium text-center">{{ getTotalComponentOnlineHours("practical") }}</TableCell>
        <TableCell class="font-medium text-center">{{ getTotalComponentF2FHours("practical") }}</TableCell>
        <TableCell class="font-medium text-center">{{ getTotalComponentOnlineHours("assessment") }}</TableCell>
        <TableCell class="font-medium text-center">{{ getTotalComponentF2FHours("assessment") }}</TableCell>
        <TableCell class="font-medium text-center">{{ getTotalComponentOnlineHours("others") }}</TableCell>
        <TableCell class="font-medium text-center">{{ getTotalComponentF2FHours("others") }}</TableCell>
        <TableCell class="font-medium text-center">{{ getTotalComponentOnlineHours("self") }}</TableCell>
        <TableCell class="font-medium text-center">{{ getTotalComponentF2FHours("self") }}</TableCell>
        <TableCell class="font-medium text-center">{{ totalSLT }}</TableCell>
      </TableRow>

      <TableRow>
        <TableCell></TableCell>
        <TableCell class="font-semibold">Total SLT Hours</TableCell>
        <TableCell></TableCell>
        <TableCell colspan="7" class="font-semibold text-center">{{ totalSLT }}</TableCell>
      </TableRow>

      <TableRow>
        <TableCell></TableCell>
        <TableCell class="font-semibold">SLT Credit Hours</TableCell>
        <TableCell></TableCell>
        <TableCell colspan="7" class="font-semibold text-center">{{ creditHours }}</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
