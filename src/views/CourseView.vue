<script setup lang="ts">
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
  BreadcrumbLink
} from '@/components/ui/breadcrumb';
import CourseSummary from '@/components/course/CourseSummary.vue';
import CourseOutcomes from '@/components/course/CourseOutcomes.vue';
import CourseAssessments from '@/components/course/CourseAssessments.vue';

import { getCourseById, type Course } from '@/lib/course';
import { onMounted, ref, type Ref } from 'vue';

const course: Ref<Course | null> = ref(null);

onMounted(() => {
  course.value = getCourseById('CS101') || null;
})
</script>

<template>
  <div class="card-plain px-4">
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/course">
            Course
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/course/ETC2073">
            Artificial Intelligence
          </BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  </div>
  <CourseSummary :course="course" />
  <CourseOutcomes :cos="course?.cos || []" />
  <CourseAssessments :assessments="course?.assessments" :coCount="course?.cos?.length || 0" />
</template>
