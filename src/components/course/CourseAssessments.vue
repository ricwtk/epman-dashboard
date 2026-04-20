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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead class="w-0 px-3">Component</TableHead>
              <TableHead class="">Method</TableHead>
              <TableHead class="w-0 text-center px-3">Weightage</TableHead>
              <TableHead class="w-0 text-center px-3" v-for="coNumber in coCount" :key="coNumber">CO{{ coNumber }}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <template v-for="(assessment, assessmentIndex) in course.assessments" :key="`assessment${assessmentIndex}`">
              <TableRow :class="editing ? 'border-b-0' : ''">
                <TableCell>
                  <span v-if="editing">
                    <Input v-model="assessment.component" class="w-50"/>
                  </span>
                  <span v-else>{{ assessment.component }}</span>
                </TableCell>
                <TableCell>
                  <span v-if="editing">
                    <Input v-model="assessment.description"/>
                  </span>
                  <span v-else>{{ assessment.description }}</span>
                </TableCell>
                <TableCell class="text-center">
                  <span v-if="editing">
                    <NumberField :min="0" v-model="assessment.weightage">
                      <NumberFieldContent>
                        <NumberFieldDecrement />
                        <NumberFieldInput class="w-30"/>
                        <NumberFieldIncrement />
                      </NumberFieldContent>
                    </NumberField>
                  </span>
                  <span v-else>{{ assessment.weightage }}</span>
                </TableCell>
                <TableCell class="text-center" v-for="coNumber in coCount" :key="`assess${assessmentIndex}co${coNumber}`">
                  <span v-if="editing">
                    <Checkbox :modelValue="assessment.cos.includes(coNumber)"
                      @update:modelValue="courseStore.toggleAssessmentMapping(assessmentIndex, -1, 'co', coNumber)"
                    />
                  </span>
                  <CheckIcon v-else class="inline-block" :size="16" v-if="assessment.cos.includes(coNumber)" />
                </TableCell>
              </TableRow>
              <TableRow v-if="editing" class="hover:bg-transparent">
                <TableCell></TableCell>
                <TableCell>
                  <div class="w-full flex flex-col gap-1">
                    <Table v-if="assessment.breakdown.length > 0">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Method</TableHead>
                          <TableHead class="w-0 px-3 text-center">Weightage</TableHead>
                          <TableHead class="w-0 px-3 text-center">CO</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                         <TableRow v-for="(breakdown, breakdownIndex) in assessment.breakdown" :key="`assess${assessmentIndex}breakdown${breakdownIndex}`">
                          <TableCell>{{ breakdown.description }}</TableCell>
                          <TableCell class="text-center">
                            <NumberField v-model="breakdown.weightage" :min="0">
                              <NumberFieldContent>
                                <NumberFieldDecrement></NumberFieldDecrement>
                                <NumberFieldInput class="w-25"></NumberFieldInput>
                                <NumberFieldIncrement></NumberFieldIncrement>
                              </NumberFieldContent>
                            </NumberField>
                          </TableCell>
                          <TableCell class="text-center">
                            <Select v-model="breakdown.co">
                              <SelectTrigger>
                                <SelectValue placeholder="Select a CO" />
                              </SelectTrigger>
                              <SelectContent>
                                <template v-for="coNumber in coCount">
                                  <SelectItem
                                    v-if="assessment.cos.includes(coNumber)"
                                    :key="`assess${assessmentIndex}breakdownco${coNumber}`"
                                    :value="coNumber"
                                  >
                                    CO {{ coNumber }}
                                  </SelectItem>
                                </template>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                    <Button variant="secondary" class="w-full" @click="courseStore.addBreakdown(assessmentIndex)">Add breakdown</Button>
                  </div>
                </TableCell>
                <TableCell></TableCell>
                <TableCell v-for="coNumber in coCount" :key="`assess${assessmentIndex}breakdownco${coNumber}`"></TableCell>
              </TableRow>
            </template>
          </TableBody>
        </Table>
        <!-- <AssessmentMainTable :assessments="course.assessments" :coCount="coCount"/> -->
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
