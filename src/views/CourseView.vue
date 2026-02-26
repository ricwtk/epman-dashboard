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

import { useViewingCourseStore } from '@/stores/viewingcourse';
const viewingCourseStore = useViewingCourseStore();

const props = defineProps<{ code: string }>();
onMounted(() => { viewingCourseStore.loadCourseByCode(props.code); });

import { useEditingCourseStore } from "@/stores/editingcourse";
const editingCourseStore = useEditingCourseStore();

const editing = ref(false);
const updateEditing = (ev: boolean, tab?: string) => {
  if (ev) {
    if (editingCourseStore.course.code !== viewingCourseStore.course.code) {
      editingCourseStore.loadCourse(toRaw(viewingCourseStore.course));
    }
    editingCourseStore.selectedTab = tab || 'summary';
  }
  editing.value = ev;
};
watch(editing, () => {
  if (!editing.value && editingCourseStore.updated) {
    viewingCourseStore.loadCourseByCode(props.code);
    editingCourseStore.updated = false;
  }
})

const deleteRevision = () => {
  viewingCourseStore.deleteRevision();
}
</script>

<template>
  <NavIndicator :items="[
    { label: 'Course', path: '/course' },
    { label: viewingCourseStore.course.name, path: `/course/${viewingCourseStore.course.code}` }
  ]"/>

  <template v-if="viewingCourseStore.course">
    <div class="card-plain px-4 text-muted-foreground text-sm flex flex-row justify-start items-center gap-2">
      {{ viewingCourseStore.course.code }} {{ viewingCourseStore.course.name }}
      <RevisionDropdown
        :current="viewingCourseStore.course.revision"
        :options="viewingCourseStore.courseRevisions.map(cour => cour.revision)"
        @selected="(rev) => viewingCourseStore.loadCourseRevision(rev)"
      />
      <div class="grow"></div>
      <RevisionDeleteButton @delete="deleteRevision" v-if="authStore.canEditCourses"/>
    </div>
    <CourseSummary
      :editable="authStore.canEditCourses"
      :course="viewingCourseStore.course"
      :editing="editing"
      @update:editing="(ev) => updateEditing(ev, 'summary')"
    />
    <CourseOutcomes
      :editable="authStore.canEditCourses"
      :cos="viewingCourseStore.course?.cos || []"
      :editing="editing"
      @update:editing="(ev) => updateEditing(ev, 'outcomes')"
    />
    <CourseAssessments
      :editable="authStore.canEditCourses"
      :assessments="viewingCourseStore.course?.assessments"
      :coCount="viewingCourseStore.course?.cos?.length || 0"
      :editing="editing"
      @update:editing="(ev) => updateEditing(ev, 'assessments')"
    />
    <CEPCEAImplementation
      :editable="authStore.canEditCourses"
      :course="viewingCourseStore.course"
      :editing="editing"
      @update:editing="(ev) => updateEditing(ev, 'assessments')"
    />
    <CoursePlan
      :editable="authStore.canEditCourses"
      :course="viewingCourseStore.course"
      :editing="editing"
      @update:editing="(ev) => updateEditing(ev, 'teachingplan')"
    />
    <CourseReferences
      :editable="authStore.canEditCourses"
      :references="viewingCourseStore.course.references || []"
      :editing="editing"
      @update:editing="(ev) => updateEditing(ev, 'references')"
    />
    <CourseUpdateDialog v-model:isOpen="editing" />
  </template>
</template>
