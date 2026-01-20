<script setup lang="ts">
import { type Assessment } from '@/lib/course';

const props = defineProps<{
  assessments: Assessment[] | undefined;
  coCount: number;
}>();
</script>

<template>
  <div v-for="(assessment, index) in assessments" :key="index">
    <h4>{{ assessment.description }}</h4>
    <div v-if="assessment.breakdown.length > 0">
      <div v-for="(item, itemIndex) in assessment.breakdown" :key="itemIndex">
        {{ item.description }}: {{ item.weightage }}%
      </div>
    </div>
    <div v-else>
      {{ assessment.weightage }}%
    </div>
  </div>
</template>
