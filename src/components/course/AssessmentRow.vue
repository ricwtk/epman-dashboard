<script setup lang="ts">
import { ref, computed } from 'vue';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { NumberField, NumberFieldContent, NumberFieldDecrement, NumberFieldIncrement, NumberFieldInput } from '@/components/ui/number-field';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { XIcon, CheckIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-vue-next';
import AssessmentBreakdownRow from './AssessmentBreakdownRow.vue';
import ErrorTooltip from './ErrorTooltip.vue';
import ListItemMenu from '@/components/ListItemMenu.vue';
import { InputGroup, InputGroupInput, InputGroupAddon } from '@/components/ui/input-group';
import ResetButton from '@/components/ResetButton.vue';

const props = defineProps<{
  editing: boolean;
  assessmentIndex: number;
  storeId?: string;
}>();

import { useCourseStore } from '@/stores/course';
const courseStore = useCourseStore(props.storeId || "");

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
  return details
})

const showBreakdown = ref(false)

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
  disabled: props.assessmentIndex == 0,
  callback: () => { emit('moveUp') },
}, {
  label: 'Move Down',
  icon: ChevronDownIcon,
  disabled: props.assessmentIndex == course.value.assessments.length - 1,
  callback: () => { emit('moveDown') },
}]);
</script>

<template>
  <template v-if="assessment">
    <TableRow :class="editing || showBreakdown ? 'border-b-0' : ''">
      <TableCell v-if="editing">
        <ListItemMenu :menuItems="menuItems" />
      </TableCell>
      <TableCell>
        <span v-if="editing">
          <InputGroup>
            <InputGroupInput v-model="assessment.component" class="w-30" />
            <InputGroupAddon align="inline-end">
              <ResetButton
                :show="courseStore.checkDiff(['assessments', String(props.assessmentIndex), 'component'])"
                @reset="courseStore.resetDiff(['assessments', String(props.assessmentIndex), 'component'])"
              />
            </InputGroupAddon>
          </InputGroup>
        </span>
        <span v-else>{{ assessment.component }}</span>
      </TableCell>
      <TableCell>
        <span v-if="editing">
          <InputGroup>
            <InputGroupInput v-model="assessment.description" />
            <InputGroupAddon align="inline-end">
              <ResetButton
                :show="courseStore.checkDiff(['assessments', String(props.assessmentIndex), 'description'])"
                @reset="courseStore.resetDiff(['assessments', String(props.assessmentIndex), 'description'])"
              />
            </InputGroupAddon>
          </InputGroup>
        </span>
        <span v-else class="flex items-center justify-between">
          <div>{{ assessment.description }}</div>
          <Button variant="ghost" v-if="assessment.breakdown.length > 0 && !editing" @click="showBreakdown = !showBreakdown">
            <ChevronDownIcon v-if="!showBreakdown" />
            <ChevronUpIcon v-else />
          </Button>
        </span>
      </TableCell>
      <TableCell class="text-center">
        <span v-if="editing">
          <InputGroup>
            <InputGroupInput v-model="assessment.format" class="w-30"/>
            <InputGroupAddon align="inline-end">
              <ResetButton
                :show="courseStore.checkDiff(['assessments', String(props.assessmentIndex), 'format'])"
                @reset="courseStore.resetDiff(['assessments', String(props.assessmentIndex), 'format'])"
              />
            </InputGroupAddon>
          </InputGroup>
        </span>
        <span v-else>{{ assessment.format }}</span>
      </TableCell>
      <TableCell class="text-center">
        <span v-if="editing" class="flex flex-row items-center gap-1">
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
      <TableCell class="text-center p-2!" v-for="coNumber in coCount" :key="`assess${assessmentIndex}co${coNumber}`">
        <ErrorTooltip
          :is-error="coMappingMissingError[coNumber - 1]?.isError || false"
          :message="coMappingMissingError[coNumber - 1]?.message || ''"
        >
          <Checkbox v-if="editing" :modelValue="assessment.cos.includes(coNumber)"
            @update:modelValue="courseStore.toggleAssessmentMapping(assessmentIndex, -1, coNumber, 'co', coNumber)"
            :class="coMappingMissingError[coNumber - 1]?.isError ? 'bg-destructive! border-destructive!' : ''"
          />
          <CheckIcon v-else class="inline-block" :size="16" v-if="assessment.cos.includes(coNumber)" />
        </ErrorTooltip>
      </TableCell>
    </TableRow>
    <TableRow v-if="editing || showBreakdown" class="hover:bg-transparent">
      <TableCell v-if="editing"></TableCell>
      <TableCell></TableCell>
      <TableCell>
        <div class="w-full flex flex-col gap-1">
          <Table v-if="assessment.breakdown.length > 0">
            <TableHeader>
              <TableRow>
                <TableHead v-if="editing" class="w-0"></TableHead>
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
                <AssessmentBreakdownRow
                  :store-id="props.storeId"
                  :editing="editing"
                  :assessment-index="assessmentIndex"
                  :breakdown-index="breakdownIndex"
                  @remove="courseStore.deleteBreakdown(assessmentIndex, breakdownIndex)"
                  @moveUp="courseStore.moveBreakdown(assessmentIndex, breakdownIndex, 'up')"
                  @moveDown="courseStore.moveBreakdown(assessmentIndex, breakdownIndex, 'down')"
                />
              </template>
            </TableBody>
          </Table>
          <Button v-if="editing" variant="secondary" class="w-full" @click="courseStore.addBreakdown(assessmentIndex)">Add breakdown</Button>
        </div>
      </TableCell>
      <TableCell class="text-center align-top">
        <ResetButton class="inline-block"
          :show="editing && courseStore.checkDiff(['assessments', String(props.assessmentIndex), 'weightage'])"
          @reset="courseStore.resetDiff(['assessments', String(props.assessmentIndex), 'weightage'])"
        />
      </TableCell>
      <TableCell class="text-center align-top" v-for="coNumber in coCount" :key="`assess${assessmentIndex}breakdownco${coNumber}`">
         <ResetButton class="inline-block"
          :show="editing && courseStore.checkArrayItemDiff(['assessments', String(props.assessmentIndex), 'cos'], coNumber).value"
          @reset="courseStore.resetArrayItemDiff(['assessments', String(props.assessmentIndex), 'cos'], coNumber)"
        />
      </TableCell>
    </TableRow>
  </template>
</template>
