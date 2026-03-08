<script setup lang="ts">
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { type Assessment } from '@/types/course';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import BadgeList from '@/components/BadgeList.vue';
import VerticalText from '@/components/VerticalText.vue';
import { CornerDownRightIcon, PlusIcon, MinusIcon, ListPlusIcon, ListMinusIcon } from 'lucide-vue-next';
import EmptyComponent from '@/components/EmptyComponent.vue';
import ResetButton from '@/components/ResetButton.vue';
import { Field } from '@/components/ui/field';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { NumberField, NumberFieldContent, NumberFieldInput } from '@/components/ui/number-field';

import { useCourseStore } from '@/stores/course'
const courseStore = useCourseStore()
const {
  draft,
  notAssignedToProgramme,
  programmeNotSelected,
  programmeNotAssigned
} = storeToRefs(courseStore)

const componentOptions = ['Written Assessment', 'Assignment', 'Lab'];
const addAssessment = () => { courseStore.addAssessment() }
const deleteAssessment = (index: number) => { courseStore.deleteAssessment(index) }
const addBreakdown = (index: number) => { courseStore.addBreakdown(index) }
const deleteBreakdown = (assessmentIndex: number, breakdownIndex: number) => { courseStore.deleteBreakdown(assessmentIndex, breakdownIndex) }

const handleMappingChange = (assessmentIndex: number, breakdownIndex: number, type: 'wp' | 'ea' | 'co', mappingIndex: number, checked: boolean) => {
  if (checked) {
    courseStore.addAssessmentMapping(assessmentIndex, breakdownIndex, type, mappingIndex + 1)
  } else {
    courseStore.removeAssessmentMapping(assessmentIndex, breakdownIndex, type, mappingIndex + 1)
  }
}

const wpOptions = computed(() => {
  if (courseStore.selectedSchool) {
    return courseStore.selectedSchool.components?.wps
  }
  return []
})

const eaOptions = computed(() => {
  if (courseStore.selectedSchool) {
    return courseStore.selectedSchool.components?.eas
  }
  return []
})

const totalWeightage = computed(() => {
  return draft.value.assessments.reduce((acc, assessment) => acc + assessment.weightage, 0);
});

const getPoList = (assessment: Assessment) => {
  let poList = new Set<string>();
  assessment.cos.forEach((co) => {
    draft.value.cos[co - 1]!.pos.forEach((po) => {
      poList.add(`PO${po}`);
    })
  });
  let poListArray = Array.from(poList);
  poListArray.sort();
  return poListArray;
}

const emptyComponent = computed<{
  show: boolean, title: string, description: string
}>(() => {
  if (!draft.value.assessments) return {
    show: true,
    title: 'Course object not ready',
    description: 'Wait for the course object to be ready'
  }
  else if (draft.value.assessments.length === 0) {
    return {
      show: true,
      title: 'No Assessments',
      description: 'Define assessments to display mapping matrix'
    }
  }
  else if (notAssignedToProgramme.value) {
    return {
      show: true,
      title: 'Course not assigned to any programme',
      description: 'Add course to the structure of a programme to display mapping matrices'
    }
  }
  else if (programmeNotSelected.value) {
    return {
      show: true,
      title: 'No Programme Selected',
      description: 'Select a programme to display mapping matrices'
    }
  }
  else if (programmeNotAssigned.value) {
    return {
      show: true,
      title: 'Programme not assigned to any school',
      description: `Course is assigned to ${courseStore.selectedProgramme?.name} but ${courseStore.selectedProgramme?.name} is not assigned to any school. Add the programme to a school to display mapping matrices`
    }
  }
  else {
    return {
      show: false,
      title: '',
      description: ''
    }
  }
})

const resetDiff = () => {}

import { RECOMMENDATION_CLASS } from '@/constants'
function getRecommendationClass(
  assessmentIndex: number,
  breakdownIndex: number,
  type: 'wp' | 'ea',
  mappingIndex: number
): string {
  if (
    (breakdownIndex === -1)
    && (courseStore.recommendedMappingForAssessment[assessmentIndex]?.[type]?.has(mappingIndex + 1))
  ) {
      return RECOMMENDATION_CLASS
  } else if (
    (breakdownIndex !== -1)
    && (courseStore.recommendedMappingForAssessment[assessmentIndex]?.breakdown?.[breakdownIndex]?.[type]?.has(mappingIndex + 1))
  ) {
      return RECOMMENDATION_CLASS
  } else {
    return ''
  }
}
</script>

<template>
  <div class="font-semibold flex flex-row items-center gap-1 h-9">
    Assessment to CO mapping
    <ResetButton :disabled="true" @reset="resetDiff()" />
  </div>

  <template v-if="draft.assessments.length === 0">
    <EmptyComponent>
      <template #title>
        No assessments available
      </template>
      <template #description>
        <Button variant="default" @click="addAssessment"><PlusIcon /> Click to add an assessment</Button>
      </template>
    </EmptyComponent>
  </template>

  <Table v-else>
    <TableHeader>
      <TableRow>
        <TableHead class="w-0"></TableHead>
        <TableHead colspan="2">Method</TableHead>
        <TableHead class="w-0">Component</TableHead>
        <TableHead class="text-center w-0">Weightage</TableHead>
        <TableHead class="text-center text-xs w-0" v-if="draft.cos.length == 0">Define COs to show mapping matrix</TableHead>
        <TableHead
          v-for="(co, coIndex) in draft.cos"
          :key="coIndex"
          class="text-center w-0"
        >
          {{ `CO${coIndex + 1}` }}
        </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <template v-for="(assessment, assessmentIndex) in draft.assessments" :key="assessmentIndex">
        <TableRow>
          <TableCell>
            <Button variant="destructive" @click="deleteAssessment(assessmentIndex)"><MinusIcon /></Button>
          </TableCell>
          <TableCell colspan="2">
            <Input v-model="assessment.description" class="text-sm" />
          </TableCell>
          <TableCell class="w-0 text-center">
            <Select v-model="assessment.component">
              <SelectTrigger class="w-35">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="option in componentOptions" :key="option" :value="option">
                  {{ option }}
                </SelectItem>
              </SelectContent>
            </Select>
          </TableCell>
          <TableCell class="w-0 text-center">
            <NumberField v-model="assessment.weightage" class="w-full">
              <NumberFieldContent>
                <NumberFieldInput/>
              </NumberFieldContent>
            </NumberField>
          </TableCell>
          <TableCell v-if="draft.cos.length == 0">
            <Skeleton class="h-8 w-full animate-none"/>
          </TableCell>
          <TableCell
            v-for="(co, coIndex) in draft.cos"
            :key="coIndex"
            class="w-0 text-center"
          >
            <Checkbox
              :modelValue="assessment.cos.includes(coIndex + 1)"
              @update:modelValue="(isChecked) => handleMappingChange(assessmentIndex, -1, 'co', coIndex, Boolean(isChecked))"
            />
          </TableCell>
        </TableRow>
        <TableRow v-for="(breakdown, index) in assessment.breakdown" :key="index">
          <TableCell></TableCell>
          <TableCell class="w-0">
            <Button variant="destructive" @click="deleteBreakdown(assessmentIndex, index)"><ListMinusIcon /></Button>
          </TableCell>
          <TableCell>
            <Input v-model="breakdown.description" class="text-sm" />
          </TableCell>
          <TableCell class="w-0">
            <NumberField v-model="breakdown.weightage" class="w-full">
              <NumberFieldContent>
                <NumberFieldInput/>
              </NumberFieldContent>
            </NumberField>
          </TableCell>
          <TableCell></TableCell>
          <TableCell v-if="draft.cos.length == 0">
            <Skeleton class="h-4 w-full animate-none" />
          </TableCell>
          <TableCell
            v-for="(co, coIndex) in draft.cos"
            :key="coIndex"
            class="w-0 text-center"
          >
            <Checkbox
              :modelValue="breakdown.co == coIndex + 1"
              @update:modelValue="(isChecked) => handleMappingChange(assessmentIndex, index, 'co', coIndex, Boolean(isChecked))"
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell></TableCell>
          <TableCell :colspan="draft.cos.length+4">
            <Button variant="secondary" class="w-full text-xs" size="sm" @click="addBreakdown(assessmentIndex)"><ListPlusIcon /> Add Breakdown</Button>
          </TableCell>
        </TableRow>
      </template>
      <TableRow>
        <TableCell :colspan="draft.cos.length+5">
          <Button variant="default" class="w-full text-xs" size="sm" @click="addAssessment"><PlusIcon /> Add Assessment</Button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell></TableCell>
        <TableCell></TableCell>
        <TableCell></TableCell>
        <TableCell class="text-right font-medium">Total</TableCell>
        <TableCell
          class="text-center font-medium"
          :class="totalWeightage === 100 ? '' : 'bg-destructive text-white'"
        >{{ totalWeightage }}</TableCell>
        <TableCell v-for="_ in draft.cos.length"></TableCell>
      </TableRow>
    </TableBody>
  </Table>

  <template v-if="draft.assessments.length > 0">
    <Field orientation="horizontal" class="my-2">
      <Label>Programme</Label>
      <Select :modelValue="courseStore.selectedProgrammeCode" @update:modelValue="(value) => courseStore.selectedProgrammeCode = String(value)">
        <SelectTrigger class="grow">
          <SelectValue placeholder="Select"/>
        </SelectTrigger>
        <SelectContent>
          <template v-for="(progKey, index) in Object.keys(courseStore.programmes)" :key="index">
            <SelectItem :value="progKey">{{ courseStore.programmes[progKey]?.name }}</SelectItem>
          </template>
        </SelectContent>
      </Select>
      <Select v-model="courseStore.selectedProgramme" :options="Object.keys(courseStore.programmes)" />
    </Field>

    <div class="font-semibold">Assessment to WP/EA mapping</div>

    <EmptyComponent v-if="emptyComponent.show">
      <template #title>
        {{emptyComponent.title}}
      </template>
      <template #description>
        {{emptyComponent.description}}
      </template>
    </EmptyComponent>

    <Table v-else>
      <TableHeader>
        <TableRow>
          <TableHead class="align-bottom">Assessment</TableHead>
          <TableHead class="align-bottom text-center">Weightage</TableHead>
          <TableHead class="align-bottom text-center">CO</TableHead>
          <TableHead class="align-bottom text-center">PO</TableHead>
          <TableHead
            v-for="(wp, wpIndex) in wpOptions"
            :key="wpIndex"
            class="align-bottom text-center"
            :title="wp.descriptor"
          >
            <VerticalText :label="`WP${Number(wpIndex)+1}`" :content="wp.attribute" />
          </TableHead>
          <TableHead class="w-0 bg-border"></TableHead>
          <TableHead
            v-for="(ea, eaIndex) in eaOptions"
            :key="eaIndex"
            class="align-bottom text-center"
            :title="ea.descriptor"
          >
            <VerticalText :label="`EA${Number(eaIndex)+1}`" :content="ea.attribute" />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <template v-for="(assessment, assessmentIndex) in draft.assessments" :key="assessmentIndex">
          <TableRow>
            <TableCell>{{ assessment.description }}</TableCell>
            <TableCell class="text-center">{{ assessment.weightage }}</TableCell>
            <TableCell class="text-center">
              <BadgeList :items="assessment.cos.map((co) => `CO${co}`)" />
            </TableCell>
            <TableCell class="text-center">
              <BadgeList :items="getPoList(assessment)" />
            </TableCell>
            <TableCell v-for="(wp, wpIndex) in wpOptions" :key="wpIndex"
              class="text-center"
              :class="getRecommendationClass(assessmentIndex, -1, 'wp', Number(wpIndex))"
            >
              <Checkbox
                v-if="assessment.breakdown.length == 0"
                :modelValue="assessment.wps?.includes(Number(wpIndex) + 1)"
                @update:modelValue="(checked) => handleMappingChange(assessmentIndex, -1, 'wp', Number(wpIndex), Boolean(checked))"
              />
            </TableCell>
            <TableCell class="w-4 bg-border"></TableCell>
            <TableCell v-for="(ea, eaIndex) in eaOptions" :key="eaIndex"
              class="text-center"
              :class="getRecommendationClass(assessmentIndex, -1, 'ea', Number(eaIndex))"
            >
              <Checkbox
                v-if="assessment.breakdown.length == 0"
                :modelValue="assessment.eas?.includes(Number(eaIndex) + 1)"
                @update:modelValue="(checked) => handleMappingChange(assessmentIndex, -1, 'ea', Number(eaIndex), Boolean(checked))"
              />
            </TableCell>
          </TableRow>
          <template v-if="assessment.breakdown.length > 0">
            <TableRow v-for="(breakdown, breakdownIndex) in assessment.breakdown" :key="breakdownIndex">
              <TableCell class="flex flex-row items-center">
                <CornerDownRightIcon class="inline-block" :size="16" />
                <div class="inline-block ml-1">{{ breakdown.description }}</div>
              </TableCell>
              <TableCell class="text-center">{{ breakdown.weightage }}</TableCell>
              <TableCell class="text-center">
                <BadgeList :items="[`CO${breakdown.co}`]" />
              </TableCell>
              <TableCell class="text-center">
                <BadgeList :items="draft.cos[breakdown.co-1]!.pos.map((po) => `PO${po}`)" />
              </TableCell>
              <TableCell v-for="(wp, wpIndex) in wpOptions" :key="wpIndex"
                class="text-center"
                :class="getRecommendationClass(assessmentIndex, breakdownIndex, 'wp', Number(wpIndex))"
              >
                <Checkbox
                  :modelValue="breakdown.wps?.includes(Number(wpIndex) + 1)"
                  @update:modelValue="(isChecked) => handleMappingChange(assessmentIndex, breakdownIndex, 'wp', Number(wpIndex), Boolean(isChecked))"
                />
              </TableCell>
              <TableCell class="w-4 bg-border"></TableCell>
              <TableCell v-for="(ea, eaIndex) in eaOptions" :key="eaIndex"
                class="text-center"
                :class="getRecommendationClass(assessmentIndex, breakdownIndex, 'ea', Number(eaIndex))"
              >
                <Checkbox
                  :modelValue="breakdown.eas?.includes(Number(eaIndex) + 1)"
                  @update:modelValue="(isChecked) => handleMappingChange(assessmentIndex, breakdownIndex, 'ea', Number(eaIndex), Boolean(isChecked))"
                />
              </TableCell>
            </TableRow>
          </template>
        </template>
      </TableBody>
    </Table>
  </template>
</template>
