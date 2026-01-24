<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

import { Badge } from '@/components/ui/badge';
import NavIndicator from '@/components/NavIndicator.vue';

import CourseSummary from '@/components/course/CourseSummary.vue';
import CourseOutcomes from '@/components/course/CourseOutcomes.vue';
import CourseAssessments from '@/components/course/CourseAssessments.vue';
import CEPCEAImplementation from '@/components/course/CEPCEAImplementation.vue';
import CoursePlan from '@/components/course/CoursePlan.vue';
import CourseReferences from '@/components/course/CourseReferences.vue';
import CourseUpdateDialog from '@/components/course/CourseUpdateDialog.vue';

import { useViewingCourseStore } from '@/stores/viewingcourse';
const viewingCourseStore = useViewingCourseStore();

const props = defineProps<{ code: string }>();
onMounted(() => { viewingCourseStore.loadCourseByCode(props.code!); });

const editing = ref(false);
const updateEditing = (ev: boolean, ) => { editing.value = ev; };
</script>

<template>
  <NavIndicator :items="[
    { label: 'Home', path: '/' },
    { label: 'Course', path: '/course' },
    { label: 'Artificial Intelligence', path: '/course/ETC2073' }
  ]"/>

  <template v-if="viewingCourseStore.course">
    <div class="card-plain px-4 text-muted-foreground text-sm">
      {{ viewingCourseStore.course.code }} {{ viewingCourseStore.course.name }}
      <Badge>{{ viewingCourseStore.course.revision }}</Badge>
    </div>
    <CourseSummary :course="viewingCourseStore.course" :editing="editing" @update:editing="updateEditing" />
    <CourseOutcomes :cos="viewingCourseStore.course?.cos || []" :editing="editing" @update:editing="updateEditing" />
    <CourseAssessments :assessments="viewingCourseStore.course?.assessments" :coCount="viewingCourseStore.course?.cos?.length || 0" :editing="editing" @update:editing="updateEditing" />
    <CEPCEAImplementation :course="viewingCourseStore.course" :editing="editing" @update:editing="updateEditing" />
    <CoursePlan :course="viewingCourseStore.course" :editing="editing" @update:editing="updateEditing" />
    <CourseReferences :references="viewingCourseStore.course.references || []" :editing="editing" @update:editing="updateEditing" />
    <CourseUpdateDialog v-model:isOpen="editing" />
  </template>
</template>
