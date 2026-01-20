<script setup lang="ts">
import { computed } from 'vue';
import ContentCard from '@/components/contentcard/ContentCard.vue';
import { type Assessment } from '@/lib/course'
import AssessmentMainTable from '@/components/course/AssessmentMainTable.vue';
import AssessmentBreakdown from '@/components/course/AssessmentBreakdown.vue';
import { Badge } from '@/components/ui/badge';

const props = defineProps<{
  assessments: Assessment[] | undefined;
  coCount: number;
}>();

const anybreakdown = computed(() => {
  return props.assessments?.some(assessment => assessment.breakdown.length > 0);
});
</script>

<template>
  <ContentCard editable>
    <template #title>
      Assessments
    </template>
    <template #body>
      <div v-if="assessments">
        <AssessmentMainTable :assessments="assessments" :coCount="coCount"/>
        <div v-if="anybreakdown">
          <Badge class="mt-2">Breakdown</Badge>
          <AssessmentBreakdown :assessments="assessments" :coCount="coCount"/>
        </div>
      </div>
    </template>
  </ContentCard>
</template>
