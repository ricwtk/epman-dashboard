<script setup lang="ts">
import type { School } from '@/types/school';
import ContentCard from '@/components/contentcard/ContentCard.vue';
import ContentItem from '@/components/contentcard/ContentItem.vue';

const props = defineProps<{
  school: School;
  editing: boolean;
}>();

defineEmits(['update:editing']);
</script>

<template>
  <ContentCard editable :editing="editing" @update:editing="$emit('update:editing', $event)">
    <template #title>
      School Summary
    </template>
    <template #body>
      <div class="flex flex-col gap-3">
        <div class="flex flex-wrap gap-3">
          <ContentItem title="Code">
            <div>{{school.code}}</div>
          </ContentItem>
          <ContentItem title="Name">
            <div>{{school.name}}</div>
          </ContentItem>
        </div>
      </div>
    </template>
  </ContentCard>
</template>
