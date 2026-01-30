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
import { type Plan, type Allocation } from "@/types/course"

import { PlusIcon, MinusIcon, ChevronUpIcon, ChevronDownIcon } from 'lucide-vue-next';

import ResetButton from '@/components/ResetButton.vue';

import { getEditingCourseAndStore } from '@/composables/course'
const { course, editingCourseStore } = getEditingCourseAndStore()

const diffs = computed(() => {
  return editingCourseStore.checkDiff(['teachingPlan'])
})
const resetDiff = () => {
  editingCourseStore.resetDiff(['teachingPlan'])
}

const addTopic = () => {
  editingCourseStore.addTopic()
}

const removeTopic = (index: number) => {
  editingCourseStore.removeTopic(index)
}

// const teachingPlan: Plan[] = [
//   {
//     description: "Programming fundamentals and variables",
//     hours: { lecture: { online: 1, f2f: 2 }, practical: { online: 0, f2f: 0 }, tutorial: { online: 0, f2f: 0 }, self: { online: 0, f2f: 0 }, others: { online: 0, f2f: 0 }, assessment: { online: 0, f2f: 0 } }
//   }
// ]

import {
  getTotalHours,
  getTopicHours,
  getTotalComponentHours,
  getTotalComponentOnlineHours,
  getTotalComponentF2FHours,
  getTotalHoursForCourse,
  getCreditHours
} from '@/utils/courseHelpers';

const totalSLT = computed(() => getTotalHoursForCourse(course.value.teachingPlan))
const creditHours = computed(() => getCreditHours(totalSLT.value))
</script>

<template>
  <div class="font-semibold flex flex-row items-center gap-1 h-9">
    Teaching Plan
    <ResetButton v-if="diffs" @reset="resetDiff()" />
  </div>
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
      <TableRow v-for="(plan, planIndex) in course.teachingPlan">
        <TableCell class="w-0">
          <Button variant="destructive" size="icon" @click="removeTopic(planIndex)"><MinusIcon /></Button>
        </TableCell>
        <TableCell class="text-center">
          <Textarea v-model="plan.description" class="min-w-60 w-full"/>
        </TableCell>
        <TableCell class="w-0">
          <div class="flex flex-col">
            <Button variant="secondary" :disabled="planIndex === 0"><ChevronUpIcon /></Button>
            <Button variant="secondary" :disabled="planIndex === course.teachingPlan.length - 1"><ChevronDownIcon /></Button>
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
          <Button variant="default" class="w-full" @click="addTopic"><PlusIcon /></Button>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell></TableCell>
        <TableCell class="font-medium">Sub-total for each SLT components</TableCell>
        <TableCell></TableCell>
        <TableCell class="font-medium text-center">{{ getTotalComponentOnlineHours(course.teachingPlan, "lecture") }}</TableCell>
        <TableCell class="font-medium text-center">{{ getTotalComponentF2FHours(course.teachingPlan, "lecture") }}</TableCell>
        <TableCell class="font-medium text-center">{{ getTotalComponentOnlineHours(course.teachingPlan, "tutorial") }}</TableCell>
        <TableCell class="font-medium text-center">{{ getTotalComponentF2FHours(course.teachingPlan, "tutorial") }}</TableCell>
        <TableCell class="font-medium text-center">{{ getTotalComponentOnlineHours(course.teachingPlan, "practical") }}</TableCell>
        <TableCell class="font-medium text-center">{{ getTotalComponentF2FHours(course.teachingPlan, "practical") }}</TableCell>
        <TableCell class="font-medium text-center">{{ getTotalComponentOnlineHours(course.teachingPlan, "assessment") }}</TableCell>
        <TableCell class="font-medium text-center">{{ getTotalComponentF2FHours(course.teachingPlan, "assessment") }}</TableCell>
        <TableCell class="font-medium text-center">{{ getTotalComponentOnlineHours(course.teachingPlan, "others") }}</TableCell>
        <TableCell class="font-medium text-center">{{ getTotalComponentF2FHours(course.teachingPlan, "others") }}</TableCell>
        <TableCell class="font-medium text-center">{{ getTotalComponentOnlineHours(course.teachingPlan, "self") }}</TableCell>
        <TableCell class="font-medium text-center">{{ getTotalComponentF2FHours(course.teachingPlan, "self") }}</TableCell>
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
