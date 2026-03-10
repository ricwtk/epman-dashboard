<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Course, Assessment } from '@/types/course';
import ContentCard from '@/components/contentcard/ContentCard.vue';
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import BadgeList from '@/components/BadgeList.vue';
import { CheckIcon, MinusIcon } from 'lucide-vue-next';
import EmptyComponent from '@/components/EmptyComponent.vue';
import LoadingComponent from '@/components/LoadingComponent.vue';
import { ButtonGroup, ButtonGroupText } from '@/components/ui/button-group';
import type { School } from '@/types/school';

const props = defineProps<{
  course: Course;
  schools?: {[code: string]: School};
  editing: boolean
  loading?: boolean;
}>();

defineEmits(['update:editing']);

const selectedSchoolCode = ref("");
watch(() => props.schools, () => {
  if (props.schools && Object.keys(props.schools).length > 0 && selectedSchoolCode.value === "")
    selectedSchoolCode.value = Object.keys(props.schools)[0] || "";
})

const getDescriptor = (component: string, componentIndex: number): string => {
  if (props.schools && selectedSchoolCode.value) {
    const school = props.schools[selectedSchoolCode.value];
    const compKey = `${component}s`
    if (school && school.components && school.components[compKey]) {
      return school.components[compKey][componentIndex].descriptor;
    }
  }
  return ""
}
const getCEPCEA = (assessment: Assessment, coIndex: number) => {
  const descriptors: string[][] = [];
  if (assessment.breakdown.length > 0) {
    for (const item of assessment.breakdown) {
      if (item.co === coIndex) {
        if (item.wps && item.wps.length > 0) {
          descriptors.push(...item.wps.map(wp => [`WP${wp}`, `${getDescriptor("wp", wp)}`]));
        }
        if (item.eas && item.eas.length > 0) {
          descriptors.push(...item.eas.map(ea => [`EA${ea}`, `${getDescriptor("ea", ea)}`]));
        }
      }
    }
  } else {
    if (assessment.cos.includes(coIndex)) {
      if (assessment.wps && assessment.wps.length > 0) {
        descriptors.push(...assessment.wps.map(wp => [`WP${wp}`, `${getDescriptor("wp", wp)}`]));
      }
      if (assessment.eas && assessment.eas.length > 0) {
        descriptors.push(...assessment.eas.map(ea => [`EA${ea}`, `${getDescriptor("ea", ea)}`]));
      }
    }
  }
  return descriptors.map(d => d);
};

const getWeightage = (assessment: Assessment, coIndex: number) => {
  let weightage = 0;
  if (assessment.breakdown.length > 0) {
    for (const item of assessment.breakdown) {
      if (item.co === coIndex) {
        weightage += item.weightage;
      }
    }
  } else {
    if (assessment.cos.includes(coIndex)) {
      weightage += assessment.weightage / assessment.cos.length;
    }
  }
  return Math.round(weightage);
};

</script>

<template>
  <ContentCard editable :editing="editing" @update:editing="$emit('update:editing', $event)">
    <template #title>
      CEP and CEA Implementation
    </template>
    <template #body>
      <LoadingComponent :show="loading" />
      <EmptyComponent v-if="course.assessments.length === 0">
        <template #title>
          No Assessments
        </template>
        <template #description>
          Define assessments to display mapping
        </template>
      </EmptyComponent>
      <template v-else>
        <Select :modelValue="selectedSchoolCode" @update:modelValue="(value) => selectedSchoolCode = String(value)">
          <SelectTrigger class="grow">
            <SelectValue placeholder="Select"/>
          </SelectTrigger>
          <SelectContent>
            <template v-for="(schCode, index) in Object.keys(schools || {})" :key="index">
              <SelectItem :value="schCode">{{ schools?.[schCode]?.name }}</SelectItem>
            </template>
          </SelectContent>
        </Select>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead class="text-center" rowspan="2">CO</TableHead>
              <TableHead class="text-center" rowspan="2">PO</TableHead>
              <TableHead class="text-center" rowspan="2">WK</TableHead>
              <TableHead class="text-center" rowspan="2">WP</TableHead>
              <TableHead class="text-center" rowspan="2">EA</TableHead>
              <TableHead class="text-center" rowspan="2">SDG</TableHead>
              <TableHead :colspan="course.assessments.length * 2" class="text-center">
                Assessment (Weightage %)
              </TableHead>
            </TableRow>
            <TableRow>
              <template v-for="assessment in course.assessments">
                <TableHead class="text-center">{{ assessment.description }}<br />({{ assessment.weightage }}%)</TableHead>
                <TableHead class="text-center">CEP/CEA Descriptors</TableHead>
              </template>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="(co, index) in course.cos" :key="index">
              <TableCell class="text-center">CO{{ index + 1 }}</TableCell>
              <TableCell class="text-center">
                <BadgeList :items="co.pos.map((po) => 'PO'+po)" />
              </TableCell>
              <TableCell class="text-center">
                <BadgeList :items="co.wks.map((wk) => 'WK'+wk)" />
              </TableCell>
              <TableCell class="text-center">
                <BadgeList :items="co.wps.map((wp) => 'WP'+wp)" />
              </TableCell>
              <TableCell class="text-center">
                <BadgeList :items="co.eas.map((ea) => 'EA'+ea)" />
              </TableCell>
              <TableCell class="text-center">
                <CheckIcon class="inline-block" :size="16" v-if="co.sdg" />
                <MinusIcon class="inline-block" :size="16" v-else />
              </TableCell>
              <template v-for="assessment in course.assessments">
                <TableCell class="text-center">
                  <template v-if="assessment.cos.includes(index + 1)">
                    <CheckIcon class="inline-block" :size="16" />
                    <br/>
                    {{ getWeightage(assessment, index+1) }}%
                  </template>
                  <template v-else>
                    <MinusIcon class="inline-block" :size="16" />
                  </template>
                </TableCell>
                <TableCell class="text-center">
                  <div class="flex flex-col gap-1">
                    <ButtonGroup v-for="cepcea in getCEPCEA(assessment, index+1)" :key="cepcea[0]" class="gap-0!">
                      <ButtonGroupText class="w-15 flex justify-center text-sm">{{ cepcea[0] }}</ButtonGroupText>
                      <ButtonGroupText><span class="w-40 text-wrap text-xs">{{ cepcea[1] }}</span></ButtonGroupText>
                    </ButtonGroup>
                  </div>
                </TableCell>
              </template>
            </TableRow>
          </TableBody>
        </Table>
      </template>
    </template>
  </ContentCard>
</template>
