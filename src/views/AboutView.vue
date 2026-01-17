<script setup lang="ts">
import ContentCard from '@/components/contentcard/ContentCard.vue';
import { Button } from '@/components/ui/button';
</script>

<template>
  <ContentCard :editable="true">
    <template #title>
      About
    </template>
    <template #body>
      <p>This is a content card.</p>
    </template>
    <template #footer>
      <div class="justify-end flex flex-row gap-1">
        <Button variant="default">Save</Button>
        <Button variant="ghost">Cancel</Button>
      </div>
    </template>
  </ContentCard>
</template>
