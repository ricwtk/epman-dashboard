<script setup lang="ts">
import { computed } from 'vue';
import ContentCard from '@/components/contentcard/ContentCard.vue';
import { type Assessment } from '@/types/course'
import AssessmentMainTable from '@/components/course/AssessmentMainTable.vue';
import AssessmentBreakdown from '@/components/course/AssessmentBreakdown.vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableHeader, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Input } from "@/components/ui/input"
import { NumberField, NumberFieldContent, NumberFieldDecrement, NumberFieldIncrement, NumberFieldInput } from '@/components/ui/number-field';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EyeIcon, EyeOffIcon, CheckIcon } from 'lucide-vue-next';
import { ref } from 'vue';
import EmptyComponent from '@/components/EmptyComponent.vue';
import LoadingComponent from '@/components/LoadingComponent.vue';
import AssessmentRow from '@/components/course/AssessmentRow.vue';
import ErrorTooltip from '@/components/course/ErrorTooltip.vue';

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

const weightageError = computed(() => {
  const details = { isError: false, message: "" }
  const totalWeightage = course.value.assessments.reduce((sum, item) => sum + item.weightage, 0);
  if (totalWeightage !== 100) {
    details.isError = true;
    details.message = `Total weightage is ${totalWeightage}% (&#8800;100%)`;
  }
  return details;
});
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead v-if="editing" class="w-0"></TableHead>
              <TableHead class="w-0 px-3">Component</TableHead>
              <TableHead class="">Method</TableHead>
              <TableHead class="w-0 text-center px-3">
                <ErrorTooltip
                  :is-error="weightageError.isError"
                  :message="weightageError.message"
                >Weightage</ErrorTooltip>
              </TableHead>
              <TableHead class="w-0 text-center px-3" v-for="coNumber in coCount" :key="coNumber">CO{{ coNumber }}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <template v-for="(assessment, assessmentIndex) in course.assessments" :key="`assessment${assessmentIndex}`">
              <AssessmentRow
                :assessment-index="assessmentIndex"
                :editing="editing"
                @remove="courseStore.deleteAssessment(assessmentIndex)"
                @moveUp="courseStore.moveAssessment(assessmentIndex, 'up')"
                @moveDown="courseStore.moveAssessment(assessmentIndex, 'down')"
              />
            </template>
          </TableBody>
        </Table>
      </div>
    </template>
  </ContentCard>
</template>
