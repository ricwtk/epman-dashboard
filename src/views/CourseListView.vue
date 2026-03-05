<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { createNewCourse } from '@/utils/courseHelpers';
import ContentCard from '@/components/contentcard/ContentCard.vue';
import { Button } from '@/components/ui/button';
import NavIndicator from '@/components/NavIndicator.vue';
import CreateNewPopover from '@/components/CreateNewPopover.vue';

import { navigateToCourse } from '@/utils/navigationHelpers';
import { formatRevision } from '@/utils/common';
import { dataService } from '@/services/dataService';

import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();

import { useCourseListStore } from '@/stores/courselist';
const courseListStore = useCourseListStore();

const { codeToInfoMap: courses } = storeToRefs(courseListStore);
const courseList = computed(() => Object.keys(courses.value).sort((a, b) => a.localeCompare(b)));
const addNewCourse = async (newName: string, newCode: string) => {
  const newCourseParameters = {
    name: newName,
    code: newCode.toUpperCase(),
    revision: formatRevision(),
    committed: {
      on: new Date(),
      by: authStore.user?.email || 'unknown'
    }
  };
  const newCourse = createNewCourse(newCourseParameters);
  try {
    await dataService.saveCourse(newCourse);
    courseListStore.saveCourseUpdate(newCourse);
  } catch (error) {
    console.error('Error saving course:', error);
  }
}
</script>

<template>
  <NavIndicator :items="[
    { label: 'Home', path: '/' },
    { label: 'Course', path: '/course' }
  ]"/>

  <ContentCard :editable="false">
    <template #title>
      Course List
    </template>
    <template #body>
      <div class="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-4
        xl:grid-cols-5
        2xl:grid-cols-6
        gap-2
      ">
        <template v-for="courseCode in courseList" :key="courseCode">
          <Button
            variant="default"
            @click="navigateToCourse(courseCode)"
          >
            {{ courses[courseCode]!.code }} {{ courses[courseCode]!.name }}
          </Button>
        </template>
        <CreateNewPopover v-if="authStore.canEditCourses"
          :currentList="courseList"
          @create="(name:string, code:string) => addNewCourse(name, code)"
        >
          <template #title>
            New Course
          </template>
          <template #description>
            Create new course
          </template>
        </CreateNewPopover>
      </div>
    </template>
  </ContentCard>
</template>
