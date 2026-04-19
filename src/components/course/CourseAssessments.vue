<script setup lang="ts">
import { computed } from 'vue';
import ContentCard from '@/components/contentcard/ContentCard.vue';
import { type Assessment } from '@/types/course'
import AssessmentMainTable from '@/components/course/AssessmentMainTable.vue';
import AssessmentBreakdown from '@/components/course/AssessmentBreakdown.vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EyeIcon, EyeOffIcon } from 'lucide-vue-next';
import { ref } from 'vue';
import EmptyComponent from '@/components/EmptyComponent.vue';
import LoadingComponent from '@/components/LoadingComponent.vue';

import { useCourseStore } from '@/stores/course';
const courseStore = useCourseStore();
const saveCourse = () => { courseStore.save(); }

const editing = ref(false);

const course = computed({
  get: () => editing.value ? courseStore.draft : courseStore.saved,
  set: (value) => {
    if (editing.value)
      courseStore.draft = value;
    else
      courseStore.saved = value;
  },
})

const setEditing = (value: boolean) => {
  editing.value = value;
  if (courseStore.draft.code !== courseStore.saved.code) {
    courseStore.createDraft();
  }
};

const coCount = computed(() => course.value.cos.length);

// const props = defineProps<{
//   assessments: Assessment[];
//   coCount: number;
//   editing: boolean;
//   loading?: boolean;
// }>();

// defineEmits(['update:editing']);

const anybreakdown = computed(() => {
  return course.value.assessments.some(assessment => assessment.breakdown.length > 0);
});

const showBreakdown = ref(false);

const toggleBreakdown = () => {
  showBreakdown.value = !showBreakdown.value;
};
</script>

<template>
  <!-- <ContentCard editable :editing="editing" @update:editing="$emit('update:editing', $event)"> -->
  <ContentCard editable :editing="editing" @update:editing="setEditing" @save="saveCourse">
    <template #title>
      Assessments
    </template>
    <template #body>
      <LoadingComponent :show="courseStore.loading" />
      <EmptyComponent v-if="course.assessments.length === 0 && !editing">
        <template #title>
          No Assessments
        </template>
        <template #description>
          Define assessments to display mapping
        </template>
      </EmptyComponent>
      <div v-else>
        <AssessmentMainTable :assessments="course.assessments" :coCount="coCount"/>
        <div v-if="anybreakdown" class="mt-1">
          <div class="flex flex-row items-center">
            <Badge>Breakdown</Badge>
            <Button variant="ghost" @click="toggleBreakdown">
              <EyeIcon v-if="!showBreakdown" />
              <EyeOffIcon v-else />
            </Button>
          </div>
          <AssessmentBreakdown
            :assessments="course.assessments"
            :coCount="coCount"
            v-show="showBreakdown"
          />
        </div>
      </div>
    </template>
  </ContentCard>
</template>
