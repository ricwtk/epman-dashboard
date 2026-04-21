<script setup lang="ts">
import { ref, computed } from 'vue';
import { TableRow, TableCell } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { NumberField, NumberFieldContent, NumberFieldDecrement, NumberFieldIncrement, NumberFieldInput } from '@/components/ui/number-field'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import ListItemMenu from '@/components/ListItemMenu.vue'
import { XIcon, ChevronUpIcon, ChevronDownIcon } from 'lucide-vue-next'

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

const emit = defineEmits<{
  (e: 'remove'): void,
  (e: 'moveUp'): void,
  (e: 'moveDown'): void,
}>()
const menuItems = ref([{
  label: 'Remove',
  icon: XIcon,
  callback: () => { emit('remove') },
}, {
  label: 'Move Up',
  icon: ChevronUpIcon,
  disabled: props.breakdownIndex == 0,
  callback: () => { emit('moveUp') },
}, {
  label: 'Move Down',
  icon: ChevronDownIcon,
  disabled: props.breakdownIndex == course.value.assessments[props.assessmentIndex]!.breakdown.length - 1,
  callback: () => { emit('moveDown') },
}]);
</script>

<template>
  <template v-if="assessment && breakdown">
    <TableRow>
      <TableCell v-if="editing">
        <ListItemMenu :menuItems="menuItems" />
      </TableCell>
      <TableCell>
        <Input v-if="editing" v-model="breakdown.description" />
        <span v-else>{{ breakdown.description }}</span>
      </TableCell>
      <TableCell class="text-center">
        <NumberField v-if="editing" v-model="breakdown.weightage" :min="0" :max="100">
          <NumberFieldContent>
            <NumberFieldDecrement></NumberFieldDecrement>
            <NumberFieldInput class="w-25"></NumberFieldInput>
            <NumberFieldIncrement></NumberFieldIncrement>
          </NumberFieldContent>
        </NumberField>
        <span v-else>{{ breakdown.weightage }}</span>
      </TableCell>
      <TableCell class="text-center">
        <Select v-if="editing" v-model="breakdown.co" >
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
                CO{{ coNumber }}
              </SelectItem>
            </template>
          </SelectContent>
        </Select>
        <span v-else>CO{{ breakdown.co }}</span>
      </TableCell>
    </TableRow>
  </template>
</template>
