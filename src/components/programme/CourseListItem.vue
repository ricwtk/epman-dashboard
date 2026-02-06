<script setup lang="ts">
const props = defineProps<{
  code: string,
  name: string,
  credits: number,
}>();
</script>

<template>
  <div class="flex flex-col gap-1 text-xs">
    <div class="">{{ code }}</div>
    <div class="truncate" :title="name">{{ name }}</div>
    <div class="">{{ credits }}</div>
  </div>
</template>
