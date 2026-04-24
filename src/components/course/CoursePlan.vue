<script setup lang="ts">
import { ref, computed } from 'vue';
import ContentCard from '@/components/contentcard/ContentCard.vue';
import { type Allocation } from '@/types/course';
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table';
import { InputGroup, InputGroupTextarea, InputGroupAddon } from '@/components/ui/input-group';
import { NumberField, NumberFieldContent, NumberFieldDecrement, NumberFieldIncrement, NumberFieldInput } from '@/components/ui/number-field';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, TooltipArrow } from '@/components/ui/tooltip';
import { PlusIcon, XIcon, ChevronUpIcon, ChevronDownIcon } from 'lucide-vue-next';
import ResetButton from '@/components/ResetButton.vue';
import EmptyComponent from '@/components/EmptyComponent.vue';
import LoadingComponent from '@/components/LoadingComponent.vue';
import ListItemMenu from '@/components/ListItemMenu.vue';

const props = defineProps<{storeId?: string}>()

import { useCourseStore } from '@/stores/course';
const courseStore = useCourseStore(props.storeId || "");
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
  { key: 'lecture', short: 'L', label: 'Lecture' },
  { key: 'tutorial', short: 'T', label: 'Tutorial' },
  { key: 'practical', short: 'P', label: 'Practical' },
  { key: 'assessment', short: 'A', label: 'Assessment' },
  { key: 'others', short: 'O', label: 'Others' },
  { key: 'self', short: 'IL', label: 'Independent Learning' },
]
const getMenuItems = (index: number) => {
  return [{
    label: 'Remove',
    icon: XIcon,
    callback: () => { courseStore.removeTopic(index)},
  }, {
    label: 'Move Up',
    icon: ChevronUpIcon,
    disabled: index == 0,
    callback: () => { courseStore.moveTopicUp(index)},
  }, {
    label: 'Move Down',
    icon: ChevronDownIcon,
    disabled: index == course.value.teachingPlan.length - 1,
    callback: () => { courseStore.moveTopicDown(index)},
  }];
};
</script>

<template>
  <!-- <ContentCard editable :editing="editing" @update:editing="$emit('update:editing', $event)"> -->
  <ContentCard editable :editing="editing" @update:editing="setEditing" @save="saveCourse">
    <template #title>
      <div class="flex flex-row items-center gap-2">
        <div>Teaching Plan</div>
        <ResetButton :show="!!courseStore.draft.code && courseStore.checkDiff(['teachingPlan'])" @reset="courseStore.resetDiff(['teachingPlan'])" />
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
            <TableHead rowspan="2" class="w-0" v-if="editing"></TableHead>
            <TableHead rowspan="2" class="">Topics</TableHead>
            <TableHead colspan="6" class="text-center">Student Learning Time (SLT)</TableHead>
            <TableHead rowspan="2" class="text-center w-0 px-5">Topic SLT</TableHead>
          </TableRow>
          <TableRow>
            <TooltipProvider v-for="col in COLLIST">
              <Tooltip>
                <TooltipTrigger as-child>
                  <TableHead class="text-center w-30">{{ col.short }}</TableHead>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{{ col.label }}</p>
                  <TooltipArrow />
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="(plan, planIndex) in course.teachingPlan">
            <TableCell v-if="editing">
              <ListItemMenu :menuItems="getMenuItems(planIndex)" />
            </TableCell>
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
              <span v-if="editing" class="flex flex-col gap-1 items-center">
                <NumberField :min="0" v-model="plan.hours[col.key as keyof Allocation].f2f">
                  <NumberFieldContent>
                    <NumberFieldDecrement />
                    <NumberFieldInput />
                    <NumberFieldIncrement />
                  </NumberFieldContent>
                </NumberField>
                <ResetButton
                  :show="courseStore.checkDiff(['teachingPlan', String(planIndex), 'hours', col.key, 'f2f'])"
                  @reset="courseStore.resetDiff(['teachingPlan', String(planIndex), 'hours', col.key, 'f2f'])"
                />
              </span>
              <span v-else>{{ plan.hours[col.key as keyof Allocation].f2f }}</span>
            </TableCell>
            <TableCell class="text-center">{{ getTopicHours(plan.hours) }}</TableCell>
          </TableRow>
          <TableRow v-if="editing">
            <TableCell v-if="editing"></TableCell>
            <TableCell>
              <Button variant="secondary" class="w-full"
                @click="courseStore.addTopic()"
              >
                <PlusIcon />
              </Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell v-if="editing"></TableCell>
            <TableCell class="font-medium">Sub-total for each SLT components</TableCell>
            <TableCell class="font-medium text-center" v-for="col in COLLIST">
              {{ getTotalComponentHours(course.teachingPlan, col.key as keyof Allocation) }}
            </TableCell>
            <TableCell class="font-medium text-center">{{ totalSLT }}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell v-if="editing"></TableCell>
            <TableCell class="font-semibold">Total SLT Hours</TableCell>
            <TableCell colspan="7" class="font-semibold text-center">{{ totalSLT }}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell v-if="editing"></TableCell>
            <TableCell class="font-semibold">SLT Credit Hours</TableCell>
            <TableCell colspan="7" class="font-semibold text-center">{{ creditHours }}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </template>
  </ContentCard>
</template>
