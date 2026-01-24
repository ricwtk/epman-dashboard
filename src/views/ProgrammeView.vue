<script setup lang="ts">
import { onMounted, ref } from 'vue';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbLink,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';

import { navigateToPath } from '@/utils/navigationHelpers';

import { useViewingProgrammeStore } from '@/stores/viewingprogramme';
const viewingProgrammeStore = useViewingProgrammeStore();

const props = defineProps<{ code: string }>();
onMounted(() => { viewingProgrammeStore.loadProgrammeByCode(props.code!); });

const editing = ref(false);
const updateEditing = (ev: boolean, ) => { editing.value = ev; };
</script>

<template>
  <div class="card-plain px-4">
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink @click="navigateToPath('/')">
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink @click="navigateToPath('/programme')">
            Programme
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink @click="navigateToPath(`/programme/${viewingProgrammeStore.programme.code}`)">
            {{ viewingProgrammeStore.programme.name }}
          </BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  </div>
  <!-- <template v-if="course">
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
  </template> -->
</template>
