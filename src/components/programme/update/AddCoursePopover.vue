<script setup lang="ts">
import { ref, computed } from 'vue';
import { type Structure } from '@/types/programme';
import { type CourseInfo } from '@/types/course';

const props = defineProps<{
  structure: Structure,
}>();
const emits = defineEmits<{
  (e: 'addCourse', code: string): void;
}>();
const isPopoverOpen = ref(false);
const courseList = ref<CourseInfo[]>([]);
const newCode = ref('');
const newName = ref('');

const semesterOfCourse = computed((): number => {
  for (const [semesterKey, semesterCourses] of Object.entries(props.structure)) {
    if (semesterCourses.includes(newCode.value))
      return parseInt(semesterKey.slice(semesterKey.length - 2, semesterKey.length));
  }
  return -1;
});

const courseInfo = computed((): CourseInfo | undefined => {
  return courseList.value.find(course => course.code === newCode.value);
});

const message = computed(() => {
  if (semesterOfCourse.value !== -1) return `Course ${newCode.value} already exists in semester ${semesterOfCourse.value}`;
  if (courseInfo.value) return 'Course exists. Add to semester?';
  // if (!newCode.value) return 'Course code is required';
  // if (!newName.value) return 'Course name is required';
  return '';
});

const canAddCourse = computed(() => {
  return semesterOfCourse.value === -1 && courseInfo.value;
});

const canCreateCourse = computed(() => {
  return semesterOfCourse.value === -1 && !courseInfo.value;
});

const buttonEnabled = computed(() => {
  return canAddCourse.value || canCreateCourse.value;
});

const updateCourseToSemester = () => {
  if (buttonEnabled.value) {
    if (canCreateCourse.value) {
      // create course with newCode and newName
    }
    emits('addCourse', newCode.value);
    isPopoverOpen.value = false;
  }
};

import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-vue-next';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ButtonGroup, ButtonGroupText } from '@/components/ui/button-group';
</script>

<template>
  <Popover v-model:open="isPopoverOpen">
    <PopoverTrigger as-child>
      <Button
        size="sm"
        variant="secondary"
        class="w-full"
      ><PlusIcon/></Button>
    </PopoverTrigger>
    <PopoverContent class="w-80">
      <div class="grid gap-4">
        <div class="space-y-2">
          <h4 class="font-medium leading-none">
            <slot name="title">Add Course</slot>
          </h4>
          <p class="text-sm text-muted-foreground">
            <slot name="description">Add or create new course</slot>
          </p>
        </div>
        <form class="grid gap-2" @submit.prevent="updateCourseToSemester">
          <div class="grid grid-cols-3 items-center gap-4">
            <Label for="code">Code</Label>
            <Input
              id="code"
              class="col-span-2 h-8 uppercase"
              v-model="newCode"
            />
          </div>
          <div class="grid grid-cols-3 items-center gap-4" v-if="!courseInfo">
            <Label for="name">Name</Label>
            <Input
              id="name"
              class="col-span-2 h-8 uppercase"
              v-model="newName"
            />
          </div>
          <div class="grid grid-cols-3 items-center gap-4" v-if="message !== ''">
            <div></div>
            <div class="col-span-2 text-sm">
              {{ message }}
            </div>
          </div>
          <!-- <div v-if="courseInfo">
            <ButtonGroup>
              <ButtonGroupText>{{ courseInfo.code }}</ButtonGroupText>
              <ButtonGroupText>{{ courseInfo.name }}</ButtonGroupText>
            </ButtonGroup>
          </div> -->
          <div v-if="courseInfo" class="flex flex-col gap-0">
            <ButtonGroup class="gap-0! w-full">
              <ButtonGroupText>{{ courseInfo.code }}</ButtonGroupText>
              <ButtonGroupText class="grow overflow-hidden">{{ courseInfo.name }}</ButtonGroupText>
            </ButtonGroup>
          </div>

          <Button :disabled="!buttonEnabled" type="submit">
            <PlusIcon />
            <span>Add/Create</span>
          </Button>
        </form>
      </div>
    </PopoverContent>
  </Popover>
</template>
