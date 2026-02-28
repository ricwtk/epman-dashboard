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
import { NumberField, NumberFieldContent, NumberFieldInput } from '@/components/ui/number-field';
import { type Plan, type Allocation } from "@/types/course"
import { SLT_CATEGORIES } from "@/constants"

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
        <TableHead colspan="2"
          v-for="(category, index) in SLT_CATEGORIES" :key="category.short"
          :title="category.long"
          class="text-center"
          :class="{ 'border-r': index !== SLT_CATEGORIES.length - 1 }"
        >{{ category.short }}</TableHead>
      </TableRow>
      <TableRow>
        <template v-for="(_, index) in 6">
          <TableHead class="w-0 text-center">Onl</TableHead>
          <TableHead class="w-0 text-center" :class="{ 'border-r': index !== 5 }">F2F</TableHead>
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
        <template
          v-for="(category, index) in SLT_CATEGORIES"
          :key="category.key"
        >
          <TableCell class="text-center">
            <NumberField v-model="plan.hours[category.key].online" class="w-8">
              <NumberFieldContent>
                <NumberFieldInput/>
              </NumberFieldContent>
            </NumberField>
          </TableCell>
          <TableCell class="text-center" :class="{ 'border-r': index !== SLT_CATEGORIES.length - 1 }">
            <NumberField v-model="plan.hours[category.key].f2f" class="w-8">
              <NumberFieldContent>
                <NumberFieldInput/>
              </NumberFieldContent>
            </NumberField>
          </TableCell>
        </template>

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
        <template v-for="(category, index) in SLT_CATEGORIES" :key="category.key">
          <TableCell class="font-medium text-center">{{ getTotalComponentOnlineHours(course.teachingPlan, category.key) }}</TableCell>
          <TableCell class="font-medium text-center" :class="{ 'border-r': index !== SLT_CATEGORIES.length-1 }">{{ getTotalComponentF2FHours(course.teachingPlan, category.key) }}</TableCell>
        </template>
        <TableCell class="font-medium text-center">{{ totalSLT }}</TableCell>
      </TableRow>

      <TableRow>
        <TableCell></TableCell>
        <TableCell class="font-semibold">Total SLT Hours</TableCell>
        <TableCell></TableCell>
        <TableCell :colspan="SLT_CATEGORIES.length*2" class="font-semibold text-center">{{ totalSLT }}</TableCell>
      </TableRow>

      <TableRow>
        <TableCell></TableCell>
        <TableCell class="font-semibold">SLT Credit Hours</TableCell>
        <TableCell></TableCell>
        <TableCell :colspan="SLT_CATEGORIES.length*2" class="font-semibold text-center">{{ creditHours }}</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
