<script setup lang="ts">
import { PlusIcon, CheckIcon } from 'lucide-vue-next'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import EmptyComponent from '@/components/EmptyComponent.vue'

defineProps<{
  items: string[][],
  selectedItems: number[]
  label?: string
  class?: string
}>()
const emit = defineEmits<{
  'select': [itemIndex: number]
}>()
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <slot name="trigger">
        <Button variant="outline" class="flex-1" :class="class">
          <PlusIcon class="inline-block" /> {{ label }}
        </Button>
      </slot>
    </PopoverTrigger>
    <PopoverContent>
      <EmptyComponent v-if="items.length === 0">
        <template #title>
          No {{ label }} list defined
        </template>
        <template #description>
          Define {{ label }} to display mapping
        </template>
      </EmptyComponent>

      <ScrollArea v-else class="h-60">
        <div class="flex flex-col gap-1 text-xs select-none">
          <template v-for="(item, itemIndex) in items" :key="item[0]">
            <div class="flex flex-row items-center gap-2 hover:bg-accent px-1 py-2 rounded"
              @click="emit('select', itemIndex)"
            >
              <div>
                <CheckIcon class="inline-block" :size="16"
                  :class="{ 'text-transparent': !selectedItems.includes(Number(item[0]!.slice(2))) }" />
              </div>
              <div class="flex flex-col">
                <div class="flex gap-1">
                  <span class="font-semibold">{{ item[0] }}</span>
                  <span class="line-clamp-1 font-medium" :title="item[1]">{{ item[1] }}</span>
                </div>
                <span class="line-clamp-3" :title="item[2]">{{ item[2] }}</span>
              </div>
            </div>
            <Separator v-if="item !== items[items.length - 1]" />
          </template>
        </div>
      </ScrollArea>
    </PopoverContent>
  </Popover>
</template>
