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
import CoursePlan from '@/components/course/CoursePlan.vue';
import CourseReferences from '@/components/course/CourseReferences.vue';
import CourseUpdateDialog from '@/components/course/CourseUpdateDialog.vue';

import type { Course } from '@/types/course';
import { getCourseByCode } from '@/utils/courseHelpers';
import { onMounted, ref, type Ref } from 'vue';

import { useViewingCourseStore } from '@/stores/viewingcourse';

const { course, loadCourseByCode } = useViewingCourseStore();

const props = defineProps<{
  code: string,
}>();

onMounted(() => {
  loadCourseByCode(props.code!);
});

const editing = ref(false);
const updateEditing = (ev: boolean, ) => {
  editing.value = ev;
};
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
    <CourseSummary :course="course" :editing="editing" @update:editing="updateEditing" />
    <CourseOutcomes :cos="course?.cos || []" :editing="editing" @update:editing="updateEditing" />
    <CourseAssessments :assessments="course?.assessments" :coCount="course?.cos?.length || 0" :editing="editing" @update:editing="updateEditing" />
    <CEPCEAImplementation :course="course" :editing="editing" @update:editing="updateEditing" />
    <CoursePlan :course="course" :editing="editing" @update:editing="updateEditing" />
    <CourseReferences :references="course.references || []" :editing="editing" @update:editing="updateEditing" />
    <CourseUpdateDialog v-model:isOpen="editing" />
  </template>
</template>
