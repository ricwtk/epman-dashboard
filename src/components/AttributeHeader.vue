<script setup lang="ts">
import type { AttrDesc } from '@/types/school';
import VerticalText from './VerticalText.vue';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';
defineProps<{
  label: string;
  attrDesc: AttrDesc
}>();
</script>

<template>
  <HoverCard>
    <HoverCardTrigger as-child>
      <VerticalText :label="label" :content="attrDesc.attribute" />
    </HoverCardTrigger>
    <HoverCardContent>
      <div class="flex flex-col gap-1 text-xs">
        <div class="flex flex-row gap-1">
          <div class="font-semibold">{{ label }}</div>
          <div class="font-normal">{{ attrDesc.attribute }}</div>
        </div>
        <div class="font-light">{{ attrDesc.descriptor }}</div>
      </div>
    </HoverCardContent>
  </HoverCard>
</template>
