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

const props = defineProps<{
  assessments: Assessment[];
  coCount: number;
  editing: boolean;
}>();

defineEmits(['update:editing']);

const anybreakdown = computed(() => {
  return props.assessments.some(assessment => assessment.breakdown.length > 0);
});

const showBreakdown = ref(false);

const toggleBreakdown = () => {
  showBreakdown.value = !showBreakdown.value;
};
</script>

<template>
  <ContentCard editable :editing="editing" @update:editing="$emit('update:editing', $event)">
    <template #title>
      Assessments
    </template>
    <template #body>
      <EmptyComponent v-if="assessments.length === 0">
        <template #title>
          No Assessments
        </template>
        <template #description>
          Define assessments to display mapping
        </template>
      </EmptyComponent>
      <div v-else>
        <AssessmentMainTable :assessments="assessments" :coCount="coCount"/>
        <div v-if="anybreakdown" class="mt-1">
          <div class="flex flex-row items-center">
            <Badge>Breakdown</Badge>
            <Button variant="ghost" @click="toggleBreakdown">
              <EyeIcon v-if="!showBreakdown" />
              <EyeOffIcon v-else />
            </Button>
          </div>
          <AssessmentBreakdown
            :assessments="assessments"
            :coCount="coCount"
            v-show="showBreakdown"
          />
        </div>
      </div>
    </template>
  </ContentCard>
</template>
