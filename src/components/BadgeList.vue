<script setup lang="ts">
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, TooltipArrow } from '@/components/ui/tooltip';
import { CircleXIcon } from 'lucide-vue-next';

const props = defineProps<{
  items: string[];
  editing?: boolean;
  tooltips?: string[];
}>();

const emit = defineEmits<{
  (e: 'remove', item: string): void;
}>();
</script>

<template>
  <div class="flex flex-col items-center gap-0.5">
    <template v-for="(item, index) in items" :key="item">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Badge variant="secondary" class="max-w-full flex justify-between">
              <span class="text-wrap select-none">{{ item }}</span>
              <span v-if="editing" @click="emit('remove', item)">
                <slot name="editIcon">
                  <CircleXIcon :size="14"/>
                </slot>
              </span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent v-if="tooltips && tooltips[index]">
            {{ tooltips[index] }}
            <TooltipArrow />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </template>
  </div>
</template>
