<script setup lang="ts">
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
  BreadcrumbLink
} from '@/components/ui/breadcrumb';
import { Badge } from '@/components/ui/badge';
import CourseSummary from '@/components/course/CourseSummary.vue';
import CourseOutcomes from '@/components/course/CourseOutcomes.vue';
import CourseAssessments from '@/components/course/CourseAssessments.vue';
import CEPCEAImplementation from '@/components/course/CEPCEAImplementation.vue';

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
  <template v-if="course">
    <div class="card-plain px-4 text-muted-foreground text-sm">
      {{ course.code }} {{ course.name }}
      <Badge>{{ course.revision }}</Badge>
    </div>
    <CourseSummary :course="course" />
    <CourseOutcomes :cos="course?.cos || []" />
    <CourseAssessments :assessments="course?.assessments" :coCount="course?.cos?.length || 0" />
    <CEPCEAImplementation :course="course" />
  </template>
</template>
