<script setup lang="ts">
import { ref, computed } from 'vue';
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

import { getEditingCourseAndStore } from '@/composables/course'
const { course, editingCourseStore } = getEditingCourseAndStore()


const componentOptions = ['Written Assessment', 'Assignment', 'Lab'];
const updateMapping = (pathArray: string[], itemIndex: number, isChecked: boolean | 'indeterminate') => {
  if (isChecked === 'indeterminate') { return; }
  editingCourseStore.updateMapping(["assessments", ...pathArray], itemIndex, isChecked)
}
const addAssessment = () => { editingCourseStore.addAssessment() }
const deleteAssessment = (index: number) => { editingCourseStore.deleteAssessment(index) }
const addBreakdown = (index: number) => { editingCourseStore.addBreakdown(index) }
const deleteBreakdown = (assessmentIndex: number, breakdownIndex: number) => { editingCourseStore.deleteBreakdown(assessmentIndex, breakdownIndex) }
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
  return course.value.assessments.reduce((acc, assessment) => acc + assessment.weightage, 0);
});

const getPoList = (assessment: Assessment) => {
  let poList = new Set<string>();
  assessment.cos.forEach((co) => {
    course.value.cos[co - 1]!.pos.forEach((po) => {
      poList.add(`PO${po}`);
    })
  });
  let poListArray = Array.from(poList);
  poListArray.sort();
  return poListArray;
}

</script>

<template>
  <div class="font-semibold">Assessment to CO mapping</div>

  <Table>
    <TableHeader>
      <TableRow>
        <TableHead></TableHead>
        <TableHead colspan="2">Method</TableHead>
        <TableHead>Component</TableHead>
        <TableHead class="text-center">Weightage</TableHead>
        <TableHead
          v-for="(co, coIndex) in course.cos"
          :key="coIndex"
          class="text-center"
        >
          {{ `CO${coIndex + 1}` }}
        </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <template v-for="(assessment, assessmentIndex) in course.assessments" :key="assessmentIndex">
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
            <Input v-model="assessment.weightage" class="text-sm" type="number" />
          </TableCell>
          <TableCell
            v-for="(co, coIndex) in course.cos"
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
            <Input v-model="breakdown.weightage" class="text-sm w-20" type="number" />
          </TableCell>
          <TableCell></TableCell>
          <TableCell
            v-for="(co, coIndex) in course.cos"
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
          <TableCell :colspan="course.cos.length+4">
            <Button variant="secondary" class="w-full text-xs" size="sm" @click="addBreakdown(assessmentIndex)"><ListPlusIcon /> Add Breakdown</Button>
          </TableCell>
        </TableRow>
      </template>
      <TableRow>
        <TableCell :colspan="course.cos.length+5">
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
        <TableCell v-for="_ in course.cos.length"></TableCell>
      </TableRow>
    </TableBody>
  </Table>

  <div class="font-semibold">Assessment to WP/EA mapping</div>

  <Table>
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
      <template v-for="(assessment, assessmentIndex) in course.assessments" :key="assessmentIndex">
        <TableRow>
          <TableCell>{{ assessment.description }}</TableCell>
          <TableCell class="text-center">{{ assessment.weightage }}</TableCell>
          <TableCell class="text-center">
            <BadgeList :items="assessment.cos.map((co) => `CO${co}`)" />
          </TableCell>
          <TableCell class="text-center">
            <BadgeList :items="getPoList(assessment)" />
          </TableCell>
          <TableCell v-for="(wp, wpIndex) in wpOptions" :key="wpIndex" class="text-center">
            <div class="flex flex-col gap-0.5 items-center">
              <span class="bg-green-600 rounded w-1 h-1"></span>
              <Checkbox
                v-if="assessment.breakdown.length == 0"
                :modelValue="assessment.wps?.includes(wpIndex + 1)"
                @update:modelValue="(checked) => updateMapping([String(assessmentIndex), 'wps'], wpIndex + 1, checked)"
              />
            </div>
          </TableCell>
          <TableCell v-for="(ea, eaIndex) in eaOptions" :key="eaIndex" class="text-center">
            <div class="flex flex-col gap-0.5 items-center">
               <span class="bg-transparent rounded w-1 h-1"></span>
              <Checkbox
                v-if="assessment.breakdown.length == 0"
                :modelValue="assessment.eas?.includes(eaIndex + 1)"
                @update:modelValue="(checked) => updateMapping([String(assessmentIndex), 'eas'], eaIndex + 1, checked)"
              />
            </div>
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
              <BadgeList :items="course.cos[breakdown.co-1]!.pos.map((po) => `PO${po}`)" />
            </TableCell>
            <TableCell v-for="(wp, wpIndex) in wpOptions" :key="wpIndex" class="text-center">
              <Checkbox
                :modelValue="breakdown.wps?.includes(wpIndex + 1)"
                @update:modelValue="(isChecked) => updateMapping([String(assessmentIndex), 'breakdown', String(breakdownIndex), 'wps'], wpIndex + 1, isChecked)"
              />
            </TableCell>
            <TableCell v-for="(ea, eaIndex) in eaOptions" :key="eaIndex" class="text-center">
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
