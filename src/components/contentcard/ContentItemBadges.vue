<script setup lang='ts'>
import { Badge } from '@/components/ui/badge';

defineProps<{
  title?: string,
  badges: string[],
  elsemessage?: string
}>();
</script>

<template>
  <div v-if="badges && badges.length > 0 || elsemessage">
    <div class="content-item-title" v-if="title">{{ title }}</div>
    <div class="flex flex-wrap gap-1">
      <Badge v-for="badge in badges" variant="secondary">{{badge}}</Badge>
      <Badge v-if="badges.length == 0"variant="outline">{{ elsemessage }}</Badge>
    </div>
  </div>
</template>
