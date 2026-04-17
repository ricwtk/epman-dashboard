<script setup lang='ts'>
import { Badge } from '@/components/ui/badge';
import BadgeList from '@/components/BadgeList.vue';
import { CirclePlusIcon, CheckIcon } from 'lucide-vue-next';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import EmptyComponent from '../EmptyComponent.vue';

defineProps<{
  title?: string,
  badges: Array<{ label: string; key: string }>,
  elsemessage?: string,
  editing?: boolean,
  options?: Array<{ label: string; key: string }>
}>();
defineEmits<{
  (e: "delete", value: string): void
}>();
</script>

<template>
  <div v-if="badges && badges.length > 0 || elsemessage">
    <div class="content-item-title" v-if="title">{{ title }}</div>
    <div class="flex flex-wrap gap-1">
      <BadgeList
        class="flex-wrap flex-row"
        :editing="editing"
        :items="badges.map(b => b.label)"
        @remove="$emit('delete', $event)"
      ></BadgeList>
      <Badge v-if="badges.length == 0"variant="outline">{{ elsemessage }}</Badge>
      <Popover v-if="editing">
        <PopoverTrigger as-child>
          <Badge variant="outline">
            <CirclePlusIcon />
          </Badge>
        </PopoverTrigger>
        <PopoverContent class="text-xs">
          <input placeholder="Search or add new" class="px-2 py-1 w-full focus:outline-none" />
          <Separator />
          <ScrollArea class="h-56">
            <div v-for="option in options"
              :key="option.key"
              class="px-2 py-2 hover:bg-accent rounded w-full flex justify-between items-center"
            >
              <span>{{ option.label }}</span>
              <span>
                <CheckIcon class="inline-block" :size="16"
                  :class="{ 'text-transparent': !badges.some(b => b.key === option.key) }"
                />
              </span>
            </div>
            <EmptyComponent v-if="!options || options.length === 0" />
          </ScrollArea>
        </PopoverContent>
      </Popover>
      <slot></slot>
    </div>
  </div>
</template>
