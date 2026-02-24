<script setup lang="ts">
import ContentCard from '@/components/contentcard/ContentCard.vue';
import type { School } from '@/types/school';

const props = defineProps<{
  school: School;
  editing: boolean;
}>();

defineEmits(['update:editing']);
</script>

<template>
  <ContentCard editable :editing="editing" @update:editing="$emit('update:editing', $event)">
    <template #title>
      Programme List
    </template>
    <template #body>
      <div class="grid grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))] gap-2">
        <div v-for="programme in 10" :key="programme">
          {{ programme }}
        </div>
        <div v-for="programme in school.programmes" :key="programme">
          {{ programme }}
        </div>
      </div>
    </template>
  </ContentCard>
</template>
