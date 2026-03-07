<script setup lang="ts">
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { type Co, type Assessment } from '@/types/course';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import BadgeList from '@/components/BadgeList.vue';
import VerticalText from '@/components/VerticalText.vue';
import { CornerDownRightIcon, PlusIcon, MinusIcon, ListPlusIcon, ListMinusIcon } from 'lucide-vue-next';
import { get } from 'lodash-es';
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

// import { getEditingCourseAndStore } from '@/composables/course'
// const { course, editingCourseStore } = getEditingCourseAndStore()


const componentOptions = ['Written Assessment', 'Assignment', 'Lab'];
const updateMapping = (pathArray: string[], itemIndex: number, isChecked: boolean | 'indeterminate') => {
  if (isChecked === 'indeterminate') { return; }
  courseStore.updateMapping(["assessments", ...pathArray], itemIndex, isChecked)
}
const addAssessment = () => { courseStore.addAssessment() }
const deleteAssessment = (index: number) => { courseStore.deleteAssessment(index) }
const addBreakdown = (index: number) => { courseStore.addBreakdown(index) }
const deleteBreakdown = (assessmentIndex: number, breakdownIndex: number) => { courseStore.deleteBreakdown(assessmentIndex, breakdownIndex) }
// const assessmentList = ref<Assessment[]>([
//   {
//     description: "Continuous Assessment",
//     component: "Written Assessment",
//     weightage: 40,
//     cos: [1, 2],
//     breakdown: [
//       { description: "Lab Exercises", weightage: 20, co: 2, wps: [2] },
//       { description: "Quiz", weightage: 20, co: 1, wps: [2], eas: [1, 2, 3] }
//     ]
//   },
//   {
//     description: "Final Examination",
//     component: "Written Assessment",
//     weightage: 60,
//     cos: [1, 2],
//     breakdown: [],
//     wps: [4]
//   }
// ])

const wpOptions = [
  "Depth of Knowledge Required",
  "Range of Conflicting Requirements",
  "Depth of Analysis Required",
  "Familiarity of Issues",
  "Extent of Applicable Codes",
  "Extent of Stakeholder Involvement and Conflicting Requirements",
  "Interdependence"
]

const eaOptions = [
  "Range of Resources",
  "Level of Interactions",
  "Innovation",
  "Consequences to Society and the Environment",
  "Familiarity"
]

const recommendedPO2WPEAMapping = {
  "exam": [
    { wp: [1,3,4], ea: [] },
    { wp: [1,3,4], ea: [] },
    { wp: [1,3,4], ea: [] },
    { wp: [1,3,4], ea: [] },
    { wp: [1,3,4], ea: [] },
    { wp: [1,3,4], ea: [] },
    { wp: [], ea: [] },
    { wp: [], ea: [] },
    { wp: [], ea: [1,2] },
    { wp: [], ea: [] },
    { wp: [], ea: [] },
  ],
  "project": [
    { wp: [1,2,3], ea: [] },
    { wp: [1,2,3], ea: [] },
    { wp: [1,2,3], ea: [] },
    { wp: [1,2,3], ea: [] },
    { wp: [1,2,3], ea: [] },
    { wp: [1,2,3], ea: [] },
    { wp: [], ea: [] },
    { wp: [], ea: [] },
    { wp: [], ea: [1,2] },
    { wp: [], ea: [] },
    { wp: [], ea: [] },
  ]
}

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
            <!-- <Input
              :class="{ 'border-destructive focus-visible:ring-destructive': totalWeightage !== 100 }"
              v-model="assessment.weightage" class="text-sm" type="number"
            /> -->
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
              @update:modelValue="(isChecked) => updateMapping([String(assessmentIndex), 'cos'], coIndex + 1, isChecked)"
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
            <!-- <Input v-model="breakdown.weightage" class="text-sm w-20" type="number" /> -->
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
              @update:modelValue="(isChecked) => updateMapping([String(assessmentIndex), 'breakdown', String(index), 'co'], coIndex + 1, isChecked)"
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
            :title="`WP${wpIndex+1} ${wp}`"
          >
            <VerticalText :label="`WP${wpIndex+1}`" :content="wp" />
          </TableHead>
          <TableHead class="w-0 bg-border"></TableHead>
          <TableHead
            v-for="(ea, eaIndex) in eaOptions"
            :key="eaIndex"
            class="align-bottom text-center"
            :title="`EA${eaIndex+1} ${ea}`"
          >
            <VerticalText :label="`EA${eaIndex+1}`" :content="ea" />
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
              :class="getRecommendationClass(assessmentIndex, -1, 'wp', wpIndex)"
            >
              <!-- <div class="flex flex-col gap-0.5 items-center"> -->
                <!-- <span class="bg-green-600 rounded w-1 h-1"></span> -->
                <Checkbox
                  v-if="assessment.breakdown.length == 0"
                  :modelValue="assessment.wps?.includes(wpIndex + 1)"
                  @update:modelValue="(checked) => updateMapping([String(assessmentIndex), 'wps'], wpIndex + 1, checked)"
                />
              <!-- </div> -->
            </TableCell>
            <TableCell class="w-4 bg-border"></TableCell>
            <TableCell v-for="(ea, eaIndex) in eaOptions" :key="eaIndex"
              class="text-center"
              :class="getRecommendationClass(assessmentIndex, -1, 'ea', eaIndex)"
            >
              <!-- <div class="flex flex-col gap-0.5 items-center"> -->
                <!-- <span class="bg-transparent rounded w-1 h-1"></span> -->
                <Checkbox
                  v-if="assessment.breakdown.length == 0"
                  :modelValue="assessment.eas?.includes(eaIndex + 1)"
                  @update:modelValue="(checked) => updateMapping([String(assessmentIndex), 'eas'], eaIndex + 1, checked)"
                />
              <!-- </div> -->
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
                :class="getRecommendationClass(assessmentIndex, breakdownIndex, 'wp', wpIndex)"
              >
                <Checkbox
                  :modelValue="breakdown.wps?.includes(wpIndex + 1)"
                  @update:modelValue="(isChecked) => updateMapping([String(assessmentIndex), 'breakdown', String(breakdownIndex), 'wps'], wpIndex + 1, isChecked)"
                />
              </TableCell>
              <TableCell class="w-4 bg-border"></TableCell>
              <TableCell v-for="(ea, eaIndex) in eaOptions" :key="eaIndex"
                class="text-center"
                :class="getRecommendationClass(assessmentIndex, breakdownIndex, 'ea', eaIndex)"
              >
                <Checkbox
                  :modelValue="breakdown.eas?.includes(eaIndex + 1)"
                  @update:modelValue="(isChecked) => updateMapping([String(assessmentIndex), 'breakdown', String(breakdownIndex), 'eas'], eaIndex + 1, isChecked)"
                />
              </TableCell>
            </TableRow>
          </template>
        </template>
      </TableBody>
    </Table>
  </template>
</template>
