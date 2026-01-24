<script setup lang="ts">
import { ref, onMounted, type Ref } from 'vue';
import { getCourseList } from '@/utils/courseHelpers';
import ContentCard from '@/components/contentcard/ContentCard.vue';
import { Button } from '@/components/ui/button';
import NavIndicator from '@/components/NavIndicator.vue';
import { navigateToCourse } from '@/utils/navigationHelpers';

const courses: Ref<{ code: string, name: string }[]> = ref([]);
onMounted(() => {
  courses.value = getCourseList();
  courses.value.sort((a, b) => a.code.localeCompare(b.code));
});
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
      </div>
    </template>
  </ContentCard>
</template>
