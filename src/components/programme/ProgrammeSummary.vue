<script setup lang="ts">
import type { Programme } from '@/types/programme';
import ContentCard from '@/components/contentcard/ContentCard.vue';
import ContentItem from '@/components/contentcard/ContentItem.vue';
import LoadingComponent from '@/components/LoadingComponent.vue';

const props = defineProps<{
  programme: Programme;
  editing: boolean;
  loading?: boolean;
}>();

defineEmits(['update:editing']);
</script>

<template>
  <ContentCard editable :editing="editing" @update:editing="$emit('update:editing', $event)">
    <template #title>
      Programme Summary
    </template>
    <template #body>
      <LoadingComponent :show="loading" />
      <div class="flex flex-col gap-3">
        <div class="flex flex-wrap gap-3">
          <ContentItem title="Code">
            <div>{{programme.code}}</div>
          </ContentItem>
          <ContentItem title="Name">
            <div>{{programme.name}}</div>
          </ContentItem>
        </div>
      </div>
    </template>
  </ContentCard>
</template>
