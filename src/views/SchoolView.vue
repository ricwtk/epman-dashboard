<script setup lang="ts">
import NavIndicator from '@/components/NavIndicator.vue';
</script>

<template>
  <NavIndicator :items="[
    { label: 'School', path: '/schools' },
    { label: 'School View', path: '/schools/:id' }
  ]"/>
</template>
