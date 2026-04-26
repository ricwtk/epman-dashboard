<script setup lang="ts">
import CourseSummary from '../course/CourseSummary.vue';
import CourseOutcomes from '../course/CourseOutcomes.vue';
import CourseAssessments from '../course/CourseAssessments.vue';
import CEPCEAImplementation from '../course/CEPCEAImplementation.vue';
import CoursePlan from '../course/CoursePlan.vue';
import ReferenceList from '../course/ReferenceList.vue';

defineProps<{
  storeId: string
}>()
</script>

<template>
  <CourseSummary
    :store-id="storeId"
    :editable="false"
  ></CourseSummary>
  <CourseOutcomes
    :store-id="storeId"
    :editable="false"
  ></CourseOutcomes>
  <CourseAssessments
    :store-id="storeId"
    :editable="false"
  ></CourseAssessments>
  <CEPCEAImplementation
    :store-id="storeId"
    :editable="false"
  ></CEPCEAImplementation>
  <CoursePlan
    :store-id="storeId"
    :editable="false"
  ></CoursePlan>
  <ReferenceList
    :store-id="storeId"
    title="Main References"
    referenceLabel="main"
  />
  <ReferenceList
    :store-id="storeId"
    title="Additional References"
    referenceLabel="additional"
  />
</template>
