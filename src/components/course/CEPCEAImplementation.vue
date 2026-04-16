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
import { CheckIcon, MinusIcon, PlusIcon, XIcon } from 'lucide-vue-next';
import EmptyComponent from '@/components/EmptyComponent.vue';
import LoadingComponent from '@/components/LoadingComponent.vue';
import { ButtonGroup, ButtonGroupText } from '@/components/ui/button-group';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
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

const selectedSchoolCode = ref("");
watch(() => courseStore.schools, () => {
  if (courseStore.schools && Object.keys(courseStore.schools).length > 0 && selectedSchoolCode.value === "")
    selectedSchoolCode.value = Object.keys(courseStore.schools)[0] || "";
})

const WPLIST = computed<Array<[string, string]>>(() => {
  if (courseStore.schools && selectedSchoolCode.value) {
    const school = courseStore.schools[selectedSchoolCode.value];
    if (school && school.components && school.components.wps) {
      return school.components.wps.map((wp: AttrDesc, index: number) => [`WP${index + 1}`, wp.descriptor]);
    }
  }
  return [];
})

const EALIST = computed<Array<[string, string]>>(() => {
  if (courseStore.schools && selectedSchoolCode.value) {
    const school = courseStore.schools[selectedSchoolCode.value];
    if (school && school.components && school.components.eas) {
      return school.components.eas.map((ea: AttrDesc, index: number) => [`EA${index + 1}`, ea.descriptor]);
    }
  }
  return [];
})

const getDescriptor = (component: string, componentIndex: number): string => {
  if (courseStore.schools && selectedSchoolCode.value) {
    const school = courseStore.schools[selectedSchoolCode.value];
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

const setCEPCEA = (assessment: Assessment, coIndex: number, wpOea: string, selected: number) => {
  let assessmentItem: { wps?: number[]; eas?: number[];[key: string]: any } = {};
  if (!['wp', 'ea'].includes(wpOea)) { return; }
  if (assessment.breakdown.length > 0) {
    for (const item of assessment.breakdown) {
      if (item.co === coIndex) {
        assessmentItem = item
      }
    }
  } else {
    if (assessment.cos.includes(coIndex)) {
      assessmentItem = assessment
    }
  }
  const componentKey = wpOea + "s"
  if (!(componentKey in assessmentItem)) { assessmentItem[componentKey] = []; }
  if (assessmentItem[componentKey].includes(selected)) {
    assessmentItem[componentKey] = assessmentItem[componentKey].filter((wpea: number) => wpea !== selected);
  } else {
    assessmentItem[componentKey].push(selected);
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
        <Select :modelValue="selectedSchoolCode" @update:modelValue="(value) => selectedSchoolCode = String(value)">
          <SelectTrigger class="grow">
            <SelectValue placeholder="Select"/>
          </SelectTrigger>
          <SelectContent>
            <template v-for="(schCode, index) in Object.keys(courseStore.schools || {})" :key="index">
              <SelectItem :value="schCode">{{ courseStore.schools?.[schCode]?.name }}</SelectItem>
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
                  <div class="flex flex-col gap-1 items-center">
                    <div class="w-full flex flex-row gap-1" v-if="editing && assessment.cos.includes(index + 1)">
                      <Popover>
                        <PopoverTrigger as-child>
                          <Button variant="outline" class="flex-1">
                            <PlusIcon class="inline-block" /> WP
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <ScrollArea class="h-60">
                            <div class="flex flex-col gap-1 text-xs select-none">
                              <template v-for="(wp, wpindex) in WPLIST" :key="wp[0]">
                                <div class="flex flex-row items-center gap-2 hover:bg-accent px-1 py-2 rounded"
                                  @click="setCEPCEA(assessment, index+1, 'wp', wpindex+1)"
                                >
                                  <div>
                                    <CheckIcon class="inline-block" :size="16"
                                      :class="{ 'text-transparent': !getCEPCEA(assessment, index+1).map(cepcea => cepcea[0]).includes(wp[0]) }" />
                                  </div>
                                  <div class="flex flex-col">
                                    <span class="font-semibold">{{ wp[0] }}</span>
                                    <span>{{ wp[1] }}</span>
                                  </div>
                                </div>
                                <Separator v-if="wp !== WPLIST[WPLIST.length - 1]" />
                              </template>
                            </div>
                          </ScrollArea>
                        </PopoverContent>
                      </Popover>
                      <Popover>
                        <PopoverTrigger as-child>
                          <Button variant="outline" class="flex-1">
                            <PlusIcon class="inline-block" /> EA
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <ScrollArea class="h-60">
                            <div class="flex flex-col gap-1 text-xs select-none">
                              <template v-for="(ea, eaIndex) in EALIST" :key="ea[0]">
                                <div class="flex flex-row items-center gap-2 hover:bg-accent px-1 py-2 rounded"
                                  @click="setCEPCEA(assessment, index+1, 'ea', eaIndex+1)"
                                >
                                  <div>
                                    <CheckIcon class="inline-block" :size="16"
                                      :class="{ 'text-transparent': !getCEPCEA(assessment, index+1).map(cepcea => cepcea[0]).includes(ea[0]) }" />
                                  </div>
                                  <div class="flex flex-col">
                                    <span class="font-semibold">{{ ea[0] }}</span>
                                    <span>{{ ea[1] }}</span>
                                  </div>
                                </div>
                                <Separator v-if="ea !== EALIST[EALIST.length - 1]" />
                              </template>
                            </div>
                          </ScrollArea>
                        </PopoverContent>
                      </Popover>
                    </div>

                    <template v-for="cepcea in getCEPCEA(assessment, index+1)" :key="cepcea[0]">
                      <ButtonGroup class="gap-0! w-full flex">
                        <ButtonGroupText class="w-15 flex justify-center text-sm">{{ cepcea[0] }}</ButtonGroupText>
                        <ButtonGroupText class="flex-1 min-w-40 text-wrap text-xs text-left line-clamp-3" :title="cepcea[1]">{{ cepcea[1] }}</ButtonGroupText>
                        <ButtonGroupText class="flex justify-center text-sm text-destructive" v-if="editing"
                          @click="setCEPCEA(assessment, index+1, cepcea[0]!.slice(0,2).toLowerCase(), Number(cepcea[0]!.slice(2,3)))"
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
