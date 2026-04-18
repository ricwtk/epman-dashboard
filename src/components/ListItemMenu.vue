<script setup lang="ts">
import type { Component } from 'vue'
import { ref } from 'vue'
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MoreVerticalIcon } from 'lucide-vue-next';

type MenuItem = {
  icon: Component
  label: string
  callback: () => void
  disabled?: boolean
  class?: string
}
const props = defineProps<{
  menuItems: MenuItem[]
}>()
const isPopoverOpen = ref(false)
const onItemClick = (item: MenuItem) => {
  if (item.disabled) return
  item.callback()
  isPopoverOpen.value = false
}
const getItemClass = (item: MenuItem) => {
  let classes = item.class ?? ''
  if (item.disabled) classes += ' text-muted-foreground'
  if (!item.disabled) classes += ' hover:bg-accent'
  return classes
}
</script>

<template>
  <Popover v-model:open="isPopoverOpen">
    <PopoverTrigger as-child>
      <slot name="trigger">
        <Button variant="ghost" class="px-1!">
          <MoreVerticalIcon />
        </Button>
      </slot>
    </PopoverTrigger>
    <PopoverContent class="w-fit text-xs p-1">
      <div class="flex flex-col gap-1">
        <div class="flex gap-2 items-center p-2 rounded"
          :class="getItemClass(item)"
          v-for="item in props.menuItems"
          @click="onItemClick(item)" :key="item.label"
        >
          <Component :is="item.icon" :size="16" /><span>{{ item.label }}</span>
        </div>
      </div>
    </PopoverContent>
  </Popover>
</template>
