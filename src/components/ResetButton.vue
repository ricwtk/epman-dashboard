<script setup lang="ts">
import { RotateCcwIcon } from 'lucide-vue-next';

const props =defineProps<{
  show?: boolean;
  size?: number;
}>();

const emit = defineEmits<{
  (e: 'reset'): void;
}>();
const onClick = () => {
  if (props.show) {
    emit('reset');
  }
};
</script>

<template>
  <span
    class="reset-button"
    :class="{ 'hide': !props.show }"
    @click="onClick"
  >
    <RotateCcwIcon :size="props.size ?? 14"/>
  </span>
</template>

<style scoped>
@reference '@/assets/base.css';
.reset-button {
  @apply text-destructive cursor-default;
}
.reset-button:hover {
  @apply text-destructive/80!;
}
.reset-button:active {
  @apply text-destructive/60;
}
.reset-button.hide {
  @apply text-transparent pointer-events-none;
}
.reset-button:disabled {
  @apply text-muted;
}
</style>
