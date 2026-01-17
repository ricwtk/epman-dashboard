<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { useSidebarStatusStore } from '@/stores/sidebarstatus';
const { sidebarstatus } = useSidebarStatusStore();
</script>

<template>
  <Button
    variant="ghost"
    class="flex flex-row items-center justify-start"
  >
    <div class="text-center">
      <slot name="icon"></slot>
    </div>
    <!-- <div class="grow text-left"> -->
    <template v-if="sidebarstatus.showText">
      <slot name="text"></slot>
    </template>
    <!-- </div> -->
  </Button>
</template>
