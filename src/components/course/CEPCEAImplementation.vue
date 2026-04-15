<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { storeToRefs } from 'pinia';
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
import { CheckIcon, MinusIcon, PlusIcon } from 'lucide-vue-next';
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
<!-- <ContentCard editable :editing="editing" @update:editing="$emit('update:editing', $event)"> -->
  <ContentCard editable :editing="editing" @update:editing="setEditing">
    <template #title>
      CEP and CEA Implementation
    </template>
    <template #body="{ editing }">
      editing: {{ editing }}
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
                    <ButtonGroup v-for="cepcea in getCEPCEA(assessment, index+1)" :key="cepcea[0]" class="gap-0!">
                      <ButtonGroupText class="w-15 flex justify-center text-sm">{{ cepcea[0] }}</ButtonGroupText>
                      <ButtonGroupText><span class="w-40 text-wrap text-xs">{{ cepcea[1] }}</span></ButtonGroupText>
                    </ButtonGroup>
                    <template v-if="editing">
                      <Popover>
                        <PopoverTrigger as-child>
                          <Button variant="outline" class="w-full">
                            <PlusIcon class="inline-block" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <ScrollArea class="h-60">
                            <div class="flex flex-col gap-1 text-xs select-none">
                              <template v-for="wp in WPLIST" :key="wp[0]">
                                <div class="flex flex-row items-center gap-2 hover:bg-accent px-1 py-2 rounded">
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
                            <!-- <ButtonGroup v-for="wp in WPLIST.filter(wp => !getCEPCEA(assessment, index+1).map(cepcea => cepcea[0]).includes(wp[0]))"
                             :key="wp[0]"
                             class="gap-0!"
                            >
                              <ButtonGroupText class="w-15 flex justify-center text-sm">{{ wp[0] }}</ButtonGroupText>
                              <ButtonGroupText><span class="w-40 text-wrap text-xs">{{ wp[1] }}</span></ButtonGroupText>
                            </ButtonGroup> -->
                            </div>
                          </ScrollArea>
                        </PopoverContent>
                      </Popover>
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
