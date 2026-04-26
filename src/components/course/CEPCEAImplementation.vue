<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Assessment, Co } from '@/types/course';
import ContentCard from '@/components/contentcard/ContentCard.vue';
import { Table, TableHeader, TableHead, TableRow, TableCell, TableBody } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import BadgeList from '@/components/BadgeList.vue';
import { CheckIcon, MinusIcon, XIcon } from 'lucide-vue-next';
import EmptyComponent from '@/components/EmptyComponent.vue';
import LoadingComponent from '@/components/LoadingComponent.vue';
import { ButtonGroup, ButtonGroupText } from '@/components/ui/button-group';
import { Checkbox } from '@/components/ui/checkbox';
import MappingSelectionMenu from '@/components/course/MappingSelectionMenu.vue';
import ResetButton from '@/components/ResetButton.vue';

const props = defineProps<{storeId?: string}>()

import { useCourseStore } from '@/stores/course';
const courseStore = useCourseStore(props.storeId || "");
const saveCourse = () => { courseStore.save(); }

import { useProgrammeListStore } from '@/stores/programmelist';
const programmeListStore = useProgrammeListStore();

const editing = ref(false);

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

import { getCEPCEA } from '@/utils/courseHelpers';

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

const checkOverallDiff = computed(() => {
  return course.value.cos.some(
    (co, coIndex) => {
      const assessmentDiff = course.value.assessments.some(
        (assessment, assessmentIndex) => {
          return courseStore.checkCEPCEADiff(assessmentIndex, coIndex+1).value
        }
      )
      return courseStore.checkDiff(['cos', String(coIndex), 'pos'])
        || courseStore.checkDiff(['cos', String(coIndex), 'wks'])
        || courseStore.checkDiff(['cos', String(coIndex), 'wps'])
        || courseStore.checkDiff(['cos', String(coIndex), 'eas'])
        || courseStore.checkDiff(['cos', String(coIndex), 'sdg'])
        || assessmentDiff
    }
  );
})

const resetAll = () => {
  course.value.cos.forEach((co, coIndex) => {
    courseStore.resetDiff(['cos', String(coIndex), 'pos']);
    courseStore.resetDiff(['cos', String(coIndex), 'wks']);
    courseStore.resetDiff(['cos', String(coIndex), 'wps']);
    courseStore.resetDiff(['cos', String(coIndex), 'eas']);
    courseStore.resetDiff(['cos', String(coIndex), 'sdg']);
    course.value.assessments.forEach((assessment, assessmentIndex) => {
      courseStore.resetCEPCEA(assessmentIndex, coIndex+1);
    });
  });
}
</script>

<template>
  <ContentCard editable :editing="editing" @update:editing="setEditing" @save="saveCourse">
    <template #title>
      <div class="flex flex-row items-center gap-2">
        <div>CEP and CEA Implementation</div>
        <ResetButton :show="!!courseStore.draft.code && checkOverallDiff" @reset="resetAll" />
      </div>
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
        <div class="flex flex-row items-center gap-2 pb-2">

          <Select v-model="programmeListStore.programmeCodeSelected">
            <SelectTrigger>
              <SelectValue placeholder="Select programme"/>
            </SelectTrigger>
            <SelectContent>
              <template v-for="(progItem, progIndex) in programmeListStore.programmeSelections || []" :key="progIndex">
                <SelectItem :value="progItem.value">{{ progItem.label }}</SelectItem>
              </template>
            </SelectContent>
          </Select>

          <span class="text-xs" v-if="programmeListStore.programmeCodeSelected">under {{ programmeListStore.selectedSchool?.name }}</span>

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
                    :items="programmeListStore.polist"
                    :selectedItems="co.pos"
                    @select="(itemIndex: number) => courseStore.toggleCoMapping(index, 'po', itemIndex + 1)"
                    label="PO"
                  />
                </template>
                <BadgeList
                  :items="co.pos.sort().map((po) => 'PO'+po)"
                  :tooltips="co.pos.sort().map((po) => programmeListStore.polist[po - 1]?.[1] || '')"
                  :editing="editing"
                  @remove="(item: string) => courseStore.removeCoMapping(index, 'po', Number(item.slice(2)))"
                />
                <ResetButton class="inline-block" v-if="editing"
                  :show="courseStore.checkDiff(['cos', String(index), 'pos'])"
                  @reset="courseStore.resetDiff(['cos', String(index), 'pos'])"
                />
              </TableCell>
              <TableCell class="text-center">
                <template v-if="editing">
                  <MappingSelectionMenu
                    class="mb-1 text-xs"
                    :items="programmeListStore.wklist"
                    :selectedItems="co.wks"
                    @select="(itemIndex: number) => courseStore.toggleCoMapping(index, 'wk', itemIndex + 1)"
                    label="WK"
                  />
                </template>
                <BadgeList
                  :items="co.wks.sort().map((wk) => 'WK'+wk)"
                  :tooltips="co.wks.sort().map((wk) => programmeListStore.wklist[wk - 1]?.[1] || '')"
                  :editing="editing"
                  @remove="(item: string) => courseStore.removeCoMapping(index, 'wk', Number(item.slice(2)))"
                />
                <ResetButton class="inline-block" v-if="editing"
                  :show="courseStore.checkDiff(['cos', String(index), 'wks'])"
                  @reset="courseStore.resetDiff(['cos', String(index), 'wks'])"
                />
              </TableCell>
              <TableCell class="text-center">
                <template v-if="editing">
                  <MappingSelectionMenu
                    class="mb-1 text-xs"
                    :items="programmeListStore.wplist"
                    :selectedItems="co.wps"
                    @select="(itemIndex: number) => courseStore.toggleCoMapping(index, 'wp', itemIndex + 1)"
                    label="WP"
                  />
                </template>
                <BadgeList
                  :items="co.wps.sort().map((wp) => 'WP'+wp)"
                  :tooltips="co.wps.sort().map((wp) => programmeListStore.wplist[wp - 1]?.[1] || '')"
                  :editing="editing"
                  @remove="(item: string) => courseStore.removeCoMapping(index, 'wp', Number(item.slice(2)))"
                />
                <ResetButton class="inline-block" v-if="editing"
                  :show="courseStore.checkDiff(['cos', String(index), 'wps'])"
                  @reset="courseStore.resetDiff(['cos', String(index), 'wps'])"
                />
              </TableCell>
              <TableCell class="text-center">
                <template v-if="editing">
                  <MappingSelectionMenu
                    class="mb-1 text-xs"
                    :items="programmeListStore.ealist"
                    :selectedItems="co.eas"
                    @select="(itemIndex: number) => courseStore.toggleCoMapping(index, 'ea', itemIndex + 1)"
                    label="EA"
                  />
                </template>
                <BadgeList
                  :items="co.eas.sort().map((ea) => 'EA'+ea)"
                  :tooltips="co.eas.sort().map((ea) => programmeListStore.ealist[ea - 1]?.[1] || '')"
                  :editing="editing"
                  @remove="(item: string) => courseStore.removeCoMapping(index, 'ea', Number(item.slice(2)))"
                />
                <ResetButton class="inline-block" v-if="editing"
                  :show="courseStore.checkDiff(['cos', String(index), 'eas'])"
                  @reset="courseStore.resetDiff(['cos', String(index), 'eas'])"
                />
              </TableCell>
              <TableCell class="text-center">
                <div class="flex flex-col items-center gap-1">
                  <Checkbox v-if="editing" v-model="co.sdg" />
                  <template v-else>
                    <CheckIcon class="inline-block" :size="16" v-if="co.sdg" />
                    <MinusIcon class="inline-block" :size="16" v-else />
                  </template>
                  <ResetButton class="inline-block" v-if="editing"
                    :show="courseStore.checkDiff(['cos', String(index), 'sdg'])"
                    @reset="courseStore.resetDiff(['cos', String(index), 'sdg'])"
                  />
                </div>
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
                        :items="programmeListStore.wplist"
                        :selectedItems="getCEPCEA(assessment, index+1, 'wp', programmeListStore.wplist).map((cepcea) => Number(cepcea[0]!.slice(2)))"
                        @select="(itemIndex: number) => courseStore.setCEPCEA(assessmentIndex, index+1, 'wp', itemIndex+1)"
                        label="WP"
                      />

                      <MappingSelectionMenu
                        :items="programmeListStore.ealist"
                        :selectedItems="getCEPCEA(assessment, index+1, 'ea', programmeListStore.ealist).map((cepcea) => Number(cepcea[0]!.slice(2)))"
                        @select="(itemIndex: number) => courseStore.setCEPCEA(assessmentIndex, index+1, 'ea', itemIndex+1)"
                        label="EA"
                      />
                    </div>

                    <template v-for="component in ['wp', 'ea']">
                      <template v-for="cepcea in getCEPCEA(assessment, index+1, component as 'wp' | 'ea', programmeListStore[`${component}list` as 'wplist' | 'ealist'])" :key="cepcea[0]">
                        <ButtonGroup class="gap-0! w-full flex">
                          <ButtonGroupText class="w-15 flex justify-center text-sm">{{ cepcea[0] }}</ButtonGroupText>
                          <ButtonGroupText class="flex-1 min-w-40 text-wrap text-xs text-left flex flex-col items-start gap-0">
                            <span class="line-clamp-1 font-medium" :title="cepcea[1]">{{ cepcea[1] }}</span>
                            <span class="line-clamp-3 font-normal" :title="cepcea[2]">{{ cepcea[2] }}</span>
                          </ButtonGroupText>
                          <ButtonGroupText class="flex justify-center text-sm text-destructive" v-if="editing"
                            @click="courseStore.setCEPCEA(assessmentIndex, index+1, cepcea[0]!.slice(0,2).toLowerCase() as 'wp' | 'ea', Number(cepcea[0]!.slice(2,3)))"
                          >
                            <XIcon />
                          </ButtonGroupText>
                        </ButtonGroup>
                        <div v-if="!checkCEPCEAinCO(co, cepcea[0]||'')" class="text-destructive mb-2 text-xs">CO{{ index + 1 }} not mapped to {{ cepcea[0] }}</div>
                      </template>
                    </template>

                    <ResetButton v-if="editing"
                      :show="courseStore.checkCEPCEADiff(assessmentIndex, index+1).value"
                      @reset="courseStore.resetCEPCEA(assessmentIndex, index+1)"
                    />
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
