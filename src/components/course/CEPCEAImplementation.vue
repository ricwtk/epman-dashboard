<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { storeToRefs } from 'pinia';
import type { Course, Assessment, Co } from '@/types/course';
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
import { CheckIcon, MinusIcon, XIcon } from 'lucide-vue-next';
import EmptyComponent from '@/components/EmptyComponent.vue';
import LoadingComponent from '@/components/LoadingComponent.vue';
import { ButtonGroup, ButtonGroupText } from '@/components/ui/button-group';
import { Checkbox } from '@/components/ui/checkbox';
import MappingSelectionMenu from '@/components/course/MappingSelectionMenu.vue';
import type { AttrDesc, School } from '@/types/school';

import { useCourseStore } from '@/stores/course';
const courseStore = useCourseStore();
const saveCourse = () => { courseStore.save(); }

const editing = ref(false);

// const props = defineProps<{
//   course: Course;
//   schools?: {[code: string]: School};
//   loading?: boolean;
//   editing: boolean
// }>();

// defineEmits(['update:editing']);

const course = computed({
  get: () => editing.value ? courseStore.draft : courseStore.saved,
  set: (value) => {
    if (editing.value)
      courseStore.draft = value;
    else
      courseStore.saved = value;
  },
})

const setEditing = (value: boolean) => {
  editing.value = value;
  if (courseStore.draft.code !== courseStore.saved.code) {
    courseStore.createDraft();
  }
};

watch(() => courseStore.programmes, () => {
  if (courseStore.programmes && Object.keys(courseStore.programmes).length > 0 && courseStore.selectedProgrammeCode === "") {
    courseStore.selectedProgrammeCode = Object.keys(courseStore.programmes)[0] || "";
    // selectedSchoolCode.value = courseStore.programmes[courseStore.selectedProgrammeCode]?.school || "";
  }
})
const selectProgramme = (progCode: string) => {
  courseStore.selectedProgrammeCode = progCode;
  // selectedSchoolCode.value = courseStore.programmes[progCode]?.school || "";
}

const getDescriptor = (component: string, componentIndex: number): string => {
  if (courseStore.selectedSchool) {
    const school = courseStore.selectedSchool;
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
          descriptors.push(...item.wps.sort().map(wp => [`WP${wp}`, `${getDescriptor("wp", wp-1)}`]));
        }
        if (item.eas && item.eas.length > 0) {
          descriptors.push(...item.eas.sort().map(ea => [`EA${ea}`, `${getDescriptor("ea", ea-1)}`]));
        }
      }
    }
  } else {
    if (assessment.cos.includes(coIndex)) {
      if (assessment.wps && assessment.wps.length > 0) {
        descriptors.push(...assessment.wps.sort().map(wp => [`WP${wp}`, `${getDescriptor("wp", wp-1)}`]));
      }
      if (assessment.eas && assessment.eas.length > 0) {
        descriptors.push(...assessment.eas.sort().map(ea => [`EA${ea}`, `${getDescriptor("ea", ea-1)}`]));
      }
    }
  }
  return descriptors.map(d => d);
};

const setCEPCEA = (assessmentIndex: number, coIndex: number, wpOea: 'wp' | 'ea', selected: number) => {
  const assessment = course.value.assessments[assessmentIndex];
  if (assessment) {
    if (assessment.breakdown.length > 0) {
      for (const [breakdownIndex, item] of assessment.breakdown.entries()) {
        if (item.co === coIndex) {
          courseStore.toggleAssessmentMapping(assessmentIndex, breakdownIndex, wpOea, selected)
        }
      }
    } else {
      if (assessment.cos.includes(coIndex)) {
        courseStore.toggleAssessmentMapping(assessmentIndex, -1, wpOea, selected)
      }
    }
  }
};

const checkCEPCEAinCO = (co: Co, cepcea: string) => {
  const cepceaComponent = cepcea.slice(0, 2).toLowerCase();
  const cepceaValue = Number(cepcea.slice(2, 3));
  const cepceaKey = cepceaComponent + "s" as keyof Co;
  if (Array.isArray(co[cepceaKey])) {
    return co[cepceaKey].includes(cepceaValue);
  } else { return false; }
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
<!-- <ContentCard editable :editing="editing" @update:editing="$emit('update:editing', $event)"> -->
  <ContentCard editable :editing="editing" @update:editing="setEditing" @save="saveCourse">
    <template #title>
      CEP and CEA Implementation
    </template>
    <template #body="{ editing }">
      <LoadingComponent :show="courseStore.loading" />
      <EmptyComponent v-if="course.assessments.length === 0">
        <template #title>
          No Assessments
        </template>
        <template #description>
          Define assessments to display mapping
        </template>
      </EmptyComponent>
      <template v-else>
        <div class="flex flex-row items-center gap-2">

          <Select :modelValue="courseStore.selectedProgrammeCode" @update:modelValue="(value) => selectProgramme(String(value))">
            <SelectTrigger>
              <SelectValue placeholder="Select"/>
            </SelectTrigger>
            <SelectContent>
              <template v-for="(progCode, index) in Object.keys(courseStore.programmes || {})" :key="index">
                <SelectItem :value="progCode">{{ courseStore.programmes?.[progCode]?.name }}</SelectItem>
              </template>
            </SelectContent>
          </Select>

          <span v-if="courseStore.selectedSchool">under {{ courseStore.selectedSchool.name }}</span>
        </div>

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
                <template v-if="editing">
                  <MappingSelectionMenu
                    class="mb-1 text-xs"
                    :items="courseStore.selectedProgramme?.poList.map((po, poIndex) => [`PO${poIndex + 1}`, po.attribute]) || []"
                    :selectedItems="co.pos"
                    @select="(itemIndex: number) => courseStore.toggleCoMapping(index, 'po', itemIndex + 1)"
                    label="PO"
                  />
                </template>
                <BadgeList
                  :items="co.pos.sort().map((po) => 'PO'+po)"
                  :editing="editing"
                  @remove="(item: string) => courseStore.removeCoMapping(index, 'po', Number(item.slice(2)))"
                />
              </TableCell>
              <TableCell class="text-center">
                <template v-if="editing">
                  <MappingSelectionMenu
                    class="mb-1 text-xs"
                    :items="courseStore.WKLIST"
                    :selectedItems="co.wks"
                    @select="(itemIndex: number) => courseStore.toggleCoMapping(index, 'wk', itemIndex + 1)"
                    label="WK"
                  />
                </template>
                <BadgeList
                  :items="co.wks.sort().map((wk) => 'WK'+wk)"
                  :editing="editing"
                  @remove="(item: string) => courseStore.removeCoMapping(index, 'wk', Number(item.slice(2)))"
                />
              </TableCell>
              <TableCell class="text-center">
                <template v-if="editing">
                  <MappingSelectionMenu
                    class="mb-1 text-xs"
                    :items="courseStore.WPLIST"
                    :selectedItems="co.wps"
                    @select="(itemIndex: number) => courseStore.toggleCoMapping(index, 'wp', itemIndex + 1)"
                    label="WP"
                  />
                </template>
                <BadgeList
                  :items="co.wps.sort().map((wp) => 'WP'+wp)"
                  :editing="editing"
                  @remove="(item: string) => courseStore.removeCoMapping(index, 'wp', Number(item.slice(2)))"
                />
              </TableCell>
              <TableCell class="text-center">
                <template v-if="editing">
                  <MappingSelectionMenu
                    class="mb-1 text-xs"
                    :items="courseStore.EALIST"
                    :selectedItems="co.eas"
                    @select="(itemIndex: number) => courseStore.toggleCoMapping(index, 'ea', itemIndex + 1)"
                    label="EA"
                  />
                </template>
                <BadgeList
                  :items="co.eas.sort().map((ea) => 'EA'+ea)"
                  :editing="editing"
                  @remove="(item: string) => courseStore.removeCoMapping(index, 'ea', Number(item.slice(2)))"
                />
              </TableCell>
              <TableCell class="text-center">
                <Checkbox v-if="editing" v-model="co.sdg" />
                <template v-else>
                  <CheckIcon class="inline-block" :size="16" v-if="co.sdg" />
                  <MinusIcon class="inline-block" :size="16" v-else />
                </template>
              </TableCell>
              <template v-for="(assessment, assessmentIndex) in course.assessments">
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
                  <div class="flex flex-col gap-1 items-center">
                    <div class="w-full flex flex-row gap-1" v-if="editing && assessment.cos.includes(index + 1)">
                      <MappingSelectionMenu
                        :items="courseStore.WPLIST"
                        :selectedItems="getCEPCEA(assessment, index+1).filter((cepcea) => cepcea[0]?.toLowerCase().startsWith('wp')).map((cepcea) => Number(cepcea[0]!.slice(2)))"
                        @select="(itemIndex: number) => setCEPCEA(assessmentIndex, index+1, 'wp', itemIndex+1)"
                        label="WP"
                      />

                      <MappingSelectionMenu
                        :items="courseStore.EALIST"
                        :selectedItems="getCEPCEA(assessment, index+1).filter((cepcea) => cepcea[0]?.toLowerCase().startsWith('ea')).map((cepcea) => Number(cepcea[0]!.slice(2)))"
                        @select="(itemIndex: number) => setCEPCEA(assessmentIndex, index+1, 'ea', itemIndex+1)"
                        label="EA"
                      />
                    </div>

                    <template v-for="cepcea in getCEPCEA(assessment, index+1)" :key="cepcea[0]">
                      <ButtonGroup class="gap-0! w-full flex">
                        <ButtonGroupText class="w-15 flex justify-center text-sm">{{ cepcea[0] }}</ButtonGroupText>
                        <ButtonGroupText class="flex-1 min-w-40 text-wrap text-xs text-left line-clamp-3" :title="cepcea[1]">{{ cepcea[1] }}</ButtonGroupText>
                        <ButtonGroupText class="flex justify-center text-sm text-destructive" v-if="editing"
                          @click="setCEPCEA(assessmentIndex, index+1, cepcea[0]!.slice(0,2).toLowerCase() as 'wp' | 'ea', Number(cepcea[0]!.slice(2,3)))"
                        >
                          <XIcon />
                        </ButtonGroupText>
                      </ButtonGroup>
                      <div v-if="!checkCEPCEAinCO(co, cepcea[0]||'')" class="text-destructive mb-2 text-xs">CO{{ index + 1 }} not mapped to {{ cepcea[0] }}</div>
                    </template>
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
