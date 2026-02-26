<script setup lang="ts">
import { ref, onMounted, type Ref } from 'vue';
import { getCourseList, createNewCourse } from '@/utils/courseHelpers';
import ContentCard from '@/components/contentcard/ContentCard.vue';
import { Button } from '@/components/ui/button';
import NavIndicator from '@/components/NavIndicator.vue';
import CreateNewPopover from '@/components/CreateNewPopover.vue';

import { navigateToCourse } from '@/utils/navigationHelpers';
import { formatRevision, getSortedUniqueLatestPartial } from '@/utils/common';
import { dataService } from '@/services/dataService';

import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();

const courses: Ref<{ code: string, name: string }[]> = ref([]);
async function updateCourseList() {
  courses.value = getSortedUniqueLatestPartial(await dataService.getCourses(), ["code", "name"]);
}
onMounted(async () => {
  await updateCourseList();
});

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
    await updateCourseList();
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
        <template v-for="course in courses" :key="course.code">
          <Button
            variant="default"
            @click="navigateToCourse(course.code)"
          >
            {{ course.code }} {{ course.name }}
          </Button>
        </template>
        <CreateNewPopover v-if="authStore.canEditCourses"
          :currentList="courses.map(course => course.code)"
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
