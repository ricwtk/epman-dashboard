<script setup lang="ts">
import { onMounted, ref } from 'vue';
import NavIndicator from '@/components/NavIndicator.vue';
import { RevisionDropdown, RevisionDeleteButton } from '@/components/revision';

import CourseSummary from '@/components/course/CourseSummary.vue';
import ProgrammeAllocation from '@/components/course/ProgrammeAllocation.vue';
import CourseOutcomes from '@/components/course/CourseOutcomes.vue';
import CourseAssessments from '@/components/course/CourseAssessments.vue';
import CEPCEAImplementation from '@/components/course/CEPCEAImplementation.vue';
import CoursePlan from '@/components/course/CoursePlan.vue';
import ReferenceList from '@/components/course/ReferenceList.vue';

import { useAuthStore } from "@/stores/auth";
const authStore = useAuthStore();

import { useCourseStore } from '@/stores/course';
const courseStore = useCourseStore();

const props = defineProps<{ code: string }>();
onMounted(() => { courseStore.loadCourseByCode(props.code); });

const editing = ref(false);
const updateEditing = (ev: boolean, tab?: string) => {
  if (ev) {
    if (courseStore.draft.code !== courseStore.saved.code) {
      courseStore.createDraft();
    }
    courseStore.editingTab = tab || 'summary';
  }
  editing.value = ev;
};
</script>

<template>
  <NavIndicator :items="[
    { label: 'Course', path: '/course' },
    { label: courseStore.saved.name, path: `/course/${courseStore.saved.code}` }
  ]"/>

  <template v-if="courseStore.saved">
    <div class="card-plain px-4 text-muted-foreground text-sm flex flex-row justify-start items-center gap-2">
      {{ courseStore.saved.code }} {{ courseStore.saved.name }}
      <RevisionDropdown
        :current="courseStore.saved.revision"
        :options="courseStore.revisions.map(cour => cour.revision)"
        @selected="(rev) => courseStore.loadRevision(rev)"
      />
      <div class="grow"></div>
      <RevisionDeleteButton @delete="courseStore.deleteRevision()" v-if="authStore.canEditCourses"/>
    </div>
    <CourseSummary
      :editable="authStore.canEditCourses"
    />
    <ProgrammeAllocation />
    <CourseOutcomes
      :editable="authStore.canEditCourses"
    />
    <CourseAssessments
      :editable="authStore.canEditCourses"
    />
    <CEPCEAImplementation
      :editable="authStore.canEditCourses"
    />
    <CoursePlan
      :editable="authStore.canEditCourses"
    />
    <ReferenceList
      title="Main References"
      referenceLabel="main"
    />
    <ReferenceList
      title="Additional References"
      referenceLabel="additional"
    />
  </template>
</template>
