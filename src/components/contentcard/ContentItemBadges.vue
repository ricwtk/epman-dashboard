<script setup lang='ts'>
import { Badge } from '@/components/ui/badge';

defineProps<{
  title: string,
  badges: string[],
  elsemessage?: string
}>();
</script>

<template>
  <div v-if="badges && badges.length > 0 || elsemessage">
    <div class="text-xs font-light text-gray-500">{{ title }}</div>
    <div v-if="badges && badges.length > 0" class="flex flex-wrap gap-1">
      <Badge v-for="badge in badges" variant="secondary">{{badge}}</Badge>
    </div>
    <div v-else>{{ elsemessage }}</div>
  </div>
</template>
