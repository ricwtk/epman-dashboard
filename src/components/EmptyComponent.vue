<script setup lang="ts">
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from '@/components/ui/empty'
import { TextSelectIcon } from 'lucide-vue-next';
</script>

<template>
  <Empty>
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <TextSelectIcon />
      </EmptyMedia>
      <EmptyTitle>
        <slot name="title">No content</slot>
      </EmptyTitle>
      <EmptyDescription>
        <slot name="description">Add content to display</slot>
      </EmptyDescription>
    </EmptyHeader>
  </Empty>
</template>
