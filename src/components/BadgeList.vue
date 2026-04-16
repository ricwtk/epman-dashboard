<script setup lang="ts">
import { Badge } from '@/components/ui/badge';
import { CircleXIcon } from 'lucide-vue-next';

const props = defineProps<{
  items: string[];
  editing?: boolean;
}>();

const emit = defineEmits<{
  (e: 'remove', item: string): void;
}>();
</script>

<template>
  <div class="flex flex-col items-center gap-0.5">
    <Badge v-for="item in items" :key="item" variant="secondary" class="max-w-full flex justify-between">
      <span class="text-wrap select-none">{{ item }}</span>
      <span v-if="editing" @click="emit('remove', item)">
        <CircleXIcon :size="14"/>
      </span>
    </Badge>
  </div>
</template>
