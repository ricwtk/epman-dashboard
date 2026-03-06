<script setup lang="ts">
import { onMounted, ref, toRaw, watch } from 'vue';
import { Badge } from '@/components/ui/badge';
import NavIndicator from '@/components/NavIndicator.vue';
import { RevisionDropdown, RevisionDeleteButton } from '@/components/revision';

import CourseSummary from '@/components/course/CourseSummary.vue';
import CourseOutcomes from '@/components/course/CourseOutcomes.vue';
import CourseAssessments from '@/components/course/CourseAssessments.vue';
import CEPCEAImplementation from '@/components/course/CEPCEAImplementation.vue';
import CoursePlan from '@/components/course/CoursePlan.vue';
import CourseReferences from '@/components/course/CourseReferences.vue';
import CourseUpdateDialog from '@/components/course/CourseUpdateDialog.vue';

import { useAuthStore } from "@/stores/auth";
const authStore = useAuthStore();

import { useCourseStore } from '@/stores/course';
const courseStore = useCourseStore();

// import { useViewingCourseStore } from '@/stores/viewingcourse';
// const viewingCourseStore = useViewingCourseStore();

const props = defineProps<{ code: string }>();
onMounted(() => { courseStore.loadCourseByCode(props.code); });

// import { useEditingCourseStore } from "@/stores/editingcourse";
// const editingCourseStore = useEditingCourseStore();

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
      :course="courseStore.saved"
      :editing="editing"
      @update:editing="(ev) => updateEditing(ev, 'summary')"
    />
    <CourseOutcomes
      :editable="authStore.canEditCourses"
      :cos="courseStore.saved.cos || []"
      :editing="editing"
      @update:editing="(ev) => updateEditing(ev, 'outcomes')"
    />
    <CourseAssessments
      :editable="authStore.canEditCourses"
      :assessments="courseStore.saved.assessments"
      :coCount="courseStore.saved.cos?.length || 0"
      :editing="editing"
      @update:editing="(ev) => updateEditing(ev, 'assessments')"
    />
    <CEPCEAImplementation
      :editable="authStore.canEditCourses"
      :course="courseStore.saved"
      :editing="editing"
      @update:editing="(ev) => updateEditing(ev, 'assessments')"
    />
    <CoursePlan
      :editable="authStore.canEditCourses"
      :course="courseStore.saved"
      :editing="editing"
      @update:editing="(ev) => updateEditing(ev, 'teachingplan')"
    />
    <CourseReferences
      :editable="authStore.canEditCourses"
      :references="courseStore.saved.references || []"
      :editing="editing"
      @update:editing="(ev) => updateEditing(ev, 'references')"
    />
    <CourseUpdateDialog v-model:isOpen="editing" />
  </template>
</template>
