<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  label: string;
  content: string;
}>();

const truncatedContent = computed(() => {
  let maxLength = 20;
  if (props.content.length <= maxLength) return props.content;
  return props.content.slice(0, maxLength - 3) + '...';
});
</script>

<template>
<span class="vertical-text">
  <span class="inline-block h-9 text-start">{{ label }}</span>
  <span class="font-light">{{ ' ' + truncatedContent }}</span>
</span>
</template>

<style scoped>
.vertical-text {
  writing-mode: sideways-lr;
  text-orientation: mixed;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
