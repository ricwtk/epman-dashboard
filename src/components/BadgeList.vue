<script setup lang="ts">
import { Badge } from '@/components/ui/badge';

const props = defineProps<{
  items: string[];
}>();
</script>

<template>
  <div class="flex flex-col items-center gap-0.5">
    <Badge v-for="item in items" :key="item" variant="secondary">
      {{ item }}
    </Badge>
  </div>
</template>
