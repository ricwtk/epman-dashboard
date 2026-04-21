<script setup lang="ts">
import { ref, computed } from 'vue';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { NumberField, NumberFieldContent, NumberFieldDecrement, NumberFieldIncrement, NumberFieldInput } from '@/components/ui/number-field';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger, TooltipArrow } from '@/components/ui/tooltip';
import { CheckIcon } from 'lucide-vue-next';
import AssessmentBreakdownRow from './AssessmentBreakdownRow.vue';
import ErrorTooltip from './ErrorTooltip.vue';

import { useCourseStore } from '@/stores/course';
const courseStore = useCourseStore();

const props = defineProps<{
  editing: boolean;
  assessmentIndex: number;
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

const breakdownWeightageError = computed(() => {
  const details = { isError: false, message: "" }
  if (assessment.value && assessment.value.breakdown.length > 0) {
    const totalWeightage = assessment.value.breakdown.reduce((sum, item) => sum + item.weightage, 0);
    if (totalWeightage !== assessment.value.weightage) {
      details.isError = true
      details.message = `Total weightage (${totalWeightage}) does not match assessment weightage (${assessment.value.weightage})`
    }
  }
  return details
})

const coMappingMissingError = computed(() => {
  const details = [...Array(coCount.value)].map(() => ({ isError: false, message: "" }))
  console.log(details)
  if (assessment.value && assessment.value.breakdown.length > 0) {
    const mappedCos = assessment.value.breakdown.reduce((acc, item) => {
      acc.add(item.co);
      return acc;
    }, new Set<number>());
    details.forEach((detail, index) => {
      if (assessment.value!.cos.includes(index + 1) && !mappedCos.has(index + 1)) {
        detail.isError = true
        detail.message = `CO${index + 1} not mapped in breakdown`
      }
    })
  }
  console.log(details)
  return details
})
</script>

<template>
  <template v-if="assessment">
    <TableRow :class="editing ? 'border-b-0' : ''">
      <TableCell>
        <span v-if="editing">
          <Input v-model="assessment.component" class="w-50"/>
        </span>
        <span v-else>{{ assessment.component }}</span>
      </TableCell>
      <TableCell>
        <span v-if="editing">
          <Input v-model="assessment.description"/>
        </span>
        <span v-else>{{ assessment.description }}</span>
      </TableCell>
      <TableCell class="text-center">
        <span v-if="editing">
          <NumberField :min="0" v-model="assessment.weightage">
            <NumberFieldContent>
              <NumberFieldDecrement />
              <NumberFieldInput class="w-30"/>
              <NumberFieldIncrement />
            </NumberFieldContent>
          </NumberField>
        </span>
        <span v-else>{{ assessment.weightage }}</span>
      </TableCell>
      <TableCell class="text-center" v-for="coNumber in coCount" :key="`assess${assessmentIndex}co${coNumber}`">
        <span v-if="editing">
          <ErrorTooltip
            :is-error="coMappingMissingError[coNumber - 1]?.isError || false"
            :message="coMappingMissingError[coNumber - 1]?.message || ''"
          >
            <Checkbox :modelValue="assessment.cos.includes(coNumber)"
              @update:modelValue="courseStore.toggleAssessmentMapping(assessmentIndex, -1, 'co', coNumber)"
              :class="coMappingMissingError[coNumber - 1]?.isError ? 'bg-destructive! border-destructive!' : ''"
            />
          </ErrorTooltip>
        </span>
        <CheckIcon v-else class="inline-block" :size="16" v-if="assessment.cos.includes(coNumber)" />
      </TableCell>
    </TableRow>
    <TableRow v-if="editing" class="hover:bg-transparent">
      <TableCell></TableCell>
      <TableCell>
        <div class="w-full flex flex-col gap-1">
          <Table v-if="assessment.breakdown.length > 0">
            <TableHeader>
              <TableRow>
                <TableHead>Method</TableHead>
                <TableHead class="w-0 px-3 text-center">
                  <ErrorTooltip
                    :is-error="breakdownWeightageError.isError"
                    :message="breakdownWeightageError.message"
                  >Weightage</ErrorTooltip>
                </TableHead>
                <TableHead class="w-0 px-3 text-center">CO</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <template v-for="(breakdown, breakdownIndex) in assessment.breakdown" :key="`assess${assessmentIndex}breakdown${breakdownIndex}`">
                <AssessmentBreakdownRow :editing="editing" :assessment-index="assessmentIndex" :breakdown-index="breakdownIndex" />
              </template>
            </TableBody>
          </Table>
          <Button variant="secondary" class="w-full" @click="courseStore.addBreakdown(assessmentIndex)">Add breakdown</Button>
        </div>
      </TableCell>
      <TableCell></TableCell>
      <TableCell v-for="coNumber in coCount" :key="`assess${assessmentIndex}breakdownco${coNumber}`"></TableCell>
    </TableRow>
  </template>
</template>
