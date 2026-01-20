<script setup lang='ts'>
defineProps<{ title: string }>();
</script>

<template>
  <div>
    <div class="content-item-title">{{ title }}</div>
    <slot></slot>
  </div>
</template>
