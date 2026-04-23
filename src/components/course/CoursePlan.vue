<script setup lang="ts">
import { ref, computed } from 'vue';
import ContentCard from '@/components/contentcard/ContentCard.vue';
import { type Allocation, type Course } from '@/types/course';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { InputGroup, InputGroupTextarea, InputGroupAddon } from '@/components/ui/input-group';
import ResetButton from '@/components/ResetButton.vue';
import EmptyComponent from '@/components/EmptyComponent.vue';
import LoadingComponent from '@/components/LoadingComponent.vue';

import { useCourseStore } from '@/stores/course';
const courseStore = useCourseStore();
const saveCourse = () => { courseStore.save(); }

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

// const props = defineProps<{
//   course: Course;
//   editing: boolean;
//   loading?: boolean;
// }>();
// defineEmits(['update:editing']);

import {
  getTotalHours,
  getTopicHours,
  getTotalComponentHours,
  getTotalHoursForCourse,
  getCreditHours
} from '@/utils/courseHelpers';

const totalSLT = computed(() => getTotalHoursForCourse(course.value.teachingPlan))
const creditHours = computed(() => getCreditHours(totalSLT.value))
const COLLIST = [
  { key: 'lecture', short: 'L' },
  { key: 'tutorial', short: 'T' },
  { key: 'practical', short: 'P' },
  { key: 'assessment', short: 'A' },
  { key: 'others', short: 'O' },
  { key: 'self', short: 'IL' },
]
</script>

<template>
  <!-- <ContentCard editable :editing="editing" @update:editing="$emit('update:editing', $event)"> -->
  <ContentCard editable :editing="editing" @update:editing="setEditing" @save="saveCourse">
    <template #title>
      <div class="flex flex-row items-center gap-2">
        <div>Teaching Plan</div>
        <ResetButton :show="courseStore.checkDiff(['teachingPlan'])" @reset="courseStore.resetDiff(['teachingPlan'])" />
      </div>
    </template>
    <template #body>
      <LoadingComponent :show="courseStore.loading" />
      <EmptyComponent v-if="course.teachingPlan.length === 0 && !editing">
        <template #title>
          No Teaching Plan
        </template>
        <template #description>
          Define topics to display plan
        </template>
      </EmptyComponent>
      <Table v-else>
        <TableHeader>
          <TableRow>
            <TableHead rowspan="2" class="">Topics</TableHead>
            <TableHead colspan="6" class="text-center">Student Learning Time (SLT)</TableHead>
            <TableHead rowspan="2" class="text-center">Topic SLT</TableHead>
          </TableRow>
          <TableRow>
            <TableHead class="text-center" v-for="col in COLLIST">{{ col.short }}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="(plan, planIndex) in course.teachingPlan">
            <TableCell>
              <span v-if="editing">
                <InputGroup>
                  <InputGroupTextarea v-model="plan.description" />
                  <InputGroupAddon align="block-end">
                    <div class="w-full flex justify-end">
                      <ResetButton
                        :show="courseStore.checkDiff(['teachingPlan', String(planIndex), 'description'])"
                        @reset="courseStore.resetDiff(['teachingPlan', String(planIndex), 'description'])"
                      />
                    </div>
                  </InputGroupAddon>
                </InputGroup>
              </span>
              <span v-else v-html="plan.description.replace(/\n/g,'<br>')"></span>
            </TableCell>
            <TableCell class="text-center" v-for="col in COLLIST">
              <span v-if="editing">

              </span>
              <!-- {{ getTotalHours(plan.hours[col.key as keyof typeof plan.hours]) }} -->
              <span v-else>{{ plan.hours[col.key as keyof Allocation].f2f }}</span>
            </TableCell>
            <TableCell class="text-center">{{ getTopicHours(plan.hours) }}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell class="font-medium">Sub-total for each SLT components</TableCell>
            <TableCell class="font-medium text-center" v-for="col in COLLIST">
              {{ getTotalComponentHours(course.teachingPlan, col.key as keyof Allocation) }}
            </TableCell>
            <TableCell class="font-medium text-center">{{ totalSLT }}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell class="font-semibold">Total SLT Hours</TableCell>
            <TableCell colspan="7" class="font-semibold text-center">{{ totalSLT }}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell class="font-semibold">SLT Credit Hours</TableCell>
            <TableCell colspan="7" class="font-semibold text-center">{{ creditHours }}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </template>
  </ContentCard>
</template>
