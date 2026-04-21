<script setup lang="ts">
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger, TooltipArrow } from '@/components/ui/tooltip';

defineProps<{
  isError: boolean;
  message: string;
}>();
</script>

<template>
  <TooltipProvider>
    <Tooltip :open="isError">
      <TooltipTrigger><slot /></TooltipTrigger>
      <TooltipContent class="border-destructive bg-destructive">
        <p v-html="message"></p>
        <TooltipArrow class="fill-destructive" />
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
