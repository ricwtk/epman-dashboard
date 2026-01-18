<script setup lang='ts'>
defineProps<{ title: string }>();
</script>

<template>
  <div>
    <div class="text-xs font-light text-gray-500">{{ title }}</div>
    <slot></slot>
  </div>
</template>
