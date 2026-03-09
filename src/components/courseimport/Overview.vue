<script setup lang="ts">
import type { Course } from '@/types/course';
import CourseSummary from '../course/CourseSummary.vue';
import CourseOutcomes from '../course/CourseOutcomes.vue';
import CourseAssessments from '../course/CourseAssessments.vue';
import CEPCEAImplementation from '../course/CEPCEAImplementation.vue';
import CoursePlan from '../course/CoursePlan.vue';
import CourseReferences from '../course/CourseReferences.vue';

defineProps<{
  course: Course
}>()
</script>

<template>
  <CourseSummary
    :course="course"
    :editing="false"
    :editable="false"
  ></CourseSummary>
  <CourseOutcomes
    :cos="course.cos"
    :editing="false"
    :editable="false"
  ></CourseOutcomes>
  <CourseAssessments
    :assessments="course.assessments"
    :coCount="course.cos?.length || 0"
    :editing="false"
    :editable="false"
  ></CourseAssessments>
  <CEPCEAImplementation
    :course="course"
    :editing="false"
    :editable="false"
  ></CEPCEAImplementation>
  <CoursePlan
    :course="course"
    :editing="false"
    :editable="false"
  ></CoursePlan>
  <CourseReferences
    :references="course.references || []"
    :editing="false"
    :editable="false"
  ></CourseReferences>
</template>
