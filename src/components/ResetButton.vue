<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { RotateCcwIcon } from 'lucide-vue-next';

defineProps<{
  disabled?: boolean;
}>();

defineEmits<{
  (e: 'reset'): void;
}>();
</script>

<template>
  <Button
    variant="ghost"
    size="icon-sm"
    class="reset-button"
    @click="$emit('reset')"
    :disabled="disabled"
  >
    <RotateCcwIcon />
  </Button>
</template>

<style scoped>
@reference '@/assets/base.css';
.reset-button {
  @apply text-destructive;
}
.reset-button:hover {
  @apply text-destructive/80!;
}
.reset-button:active {
  @apply text-destructive/60;
}
.reset-button:disabled {
  @apply text-muted;
}
</style>
