<script setup lang="ts">
import { Tooltip, TooltipTrigger, TooltipContent, TooltipArrow, TooltipProvider } from "@/components/ui/tooltip"
defineProps<{ content?: string }>()
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger as-child>
        <slot></slot>
      </TooltipTrigger>
      <TooltipContent>
        <slot name="content"><p>{{ content }}</p></slot>
        <TooltipArrow />
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
