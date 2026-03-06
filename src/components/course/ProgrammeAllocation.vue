<script setup lang="ts">
import ContentCard from '@/components/contentcard/ContentCard.vue'
import type { ProgrammesWithCourse } from '@/services/dataService';

defineProps<{
  programmes: ProgrammesWithCourse;
  editing: boolean;
}>();

defineEmits(['update:editing']);
</script>

<template>
  <ContentCard editable :editing="editing" @update:editing="$emit('update:editing', $event)">
    <template #title>
      Programme Allocation
    </template>
    <template #body="{ editing }">
      <div v-for="(prog, progKey) in programmes" :key="progKey">
        {{ progKey }}
        <div v-for="(struct, structKey) in prog.structures" :key="structKey">
          {{ structKey }}: {{ struct }}
        </div>
      </div>
    </template>
  </ContentCard>
</template>
