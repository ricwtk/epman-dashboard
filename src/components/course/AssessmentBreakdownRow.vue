<script setup lang="ts">
import { computed } from 'vue';
import { TableRow, TableCell } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { NumberField, NumberFieldContent, NumberFieldDecrement, NumberFieldIncrement, NumberFieldInput } from '@/components/ui/number-field'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'

import { useCourseStore } from '@/stores/course';
const courseStore = useCourseStore();

const props = defineProps<{
  editing: boolean;
  assessmentIndex: number;
  breakdownIndex: number
}>();

const course = computed({
  get: () => props.editing ? courseStore.draft : courseStore.saved,
  set: (value) => {
    if (props.editing)
      courseStore.draft = value;
    else
      courseStore.saved = value;
  },
})
const coCount = computed(() => course.value.cos.length);
const assessment = computed(() => course.value.assessments[props.assessmentIndex]);
const breakdown = computed(() => assessment.value ? assessment.value.breakdown[props.breakdownIndex] : null);
</script>

<template>
  <template v-if="assessment && breakdown">
    <TableRow>
      <TableCell>
        <Input v-if="editing" v-model="breakdown.description" />
        <span v-else>{{ breakdown.description }}</span>
      </TableCell>
      <TableCell class="text-center">
        <NumberField v-model="breakdown.weightage" :min="0" :max="100">
          <NumberFieldContent>
            <NumberFieldDecrement></NumberFieldDecrement>
            <NumberFieldInput class="w-25"></NumberFieldInput>
            <NumberFieldIncrement></NumberFieldIncrement>
          </NumberFieldContent>
        </NumberField>
      </TableCell>
      <TableCell class="text-center">
        <Select v-model="breakdown.co">
          <SelectTrigger>
            <SelectValue placeholder="Select a CO" />
          </SelectTrigger>
          <SelectContent>
            <template v-for="coNumber in coCount">
              <SelectItem
                v-if="assessment.cos.includes(coNumber)"
                :key="`assess${assessmentIndex}breakdownco${coNumber}`"
                :value="coNumber"
              >
                CO {{ coNumber }}
              </SelectItem>
            </template>
          </SelectContent>
        </Select>
      </TableCell>
    </TableRow>
  </template>
</template>
