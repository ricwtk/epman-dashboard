<script setup lang='ts'>
import { ref, computed } from 'vue';

import { Badge } from '@/components/ui/badge';
import BadgeList from '@/components/BadgeList.vue';
import { CirclePlusIcon, CheckIcon } from 'lucide-vue-next';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import EmptyComponent from '../EmptyComponent.vue';

const props = defineProps<{
  title?: string,
  badges: Array<{ label: string; value: string }>,
  elsemessage?: string,
  editing?: boolean,
  options?: Array<{ label: string; value: string }>
}>();
const emit = defineEmits<{
  (e: "add", value: string): void
  (e: "delete", value: string): void
}>();

const searchQuery = ref('');
const filteredOptions = computed(() => {
  if (!props.options || props.options.length === 0) return [];
  const query = searchQuery.value.toLowerCase().trim();
  if (!query) return props.options;
  return props.options.filter(option =>
    option.label.toLowerCase().includes(query) ||
    option.value.toLowerCase().includes(query)
  );
});
</script>

<template>
  <div v-if="badges && badges.length > 0 || elsemessage">
    <div class="content-item-title" v-if="title">{{ title }}</div>
    <div class="flex flex-wrap gap-1">
      <BadgeList
        class="flex-wrap flex-row"
        :editing="editing"
        :items="badges.map(b => b.label)"
        @remove="(ev) => emit('delete', badges.find(b => b.label === ev)?.value || '')"
      ></BadgeList>
      <Badge v-if="badges.length == 0"variant="outline">{{ elsemessage }}</Badge>
      <Popover v-if="editing">
        <PopoverTrigger as-child>
          <Badge variant="outline">
            <CirclePlusIcon />
          </Badge>
        </PopoverTrigger>
        <PopoverContent class="text-xs">
          <input placeholder="Search or add new"
            class="px-2 py-1 w-full focus:outline-none"
            v-model="searchQuery"
            @keydown.enter="emit('add', searchQuery.trim())"
          />
          <Separator />
          <ScrollArea class="h-56" v-if="filteredOptions.length > 0 || searchQuery">
            <div v-for="option in filteredOptions"
              :key="option.value"
              class="px-2 py-2 hover:bg-accent rounded w-full flex justify-between items-center"
              @click="emit('add', option.value)"
            >
              <span>{{ option.label }}</span>
              <span>
                <CheckIcon class="inline-block" :size="16"
                  :class="{ 'text-transparent': !badges.some(b => b.value === option.value) }"
                />
              </span>
            </div>
            <div class="px-2 py-2 hover:bg-accent rounded w-full flex justify-between items-center" v-if="searchQuery"
              @click="emit('add', searchQuery.trim())"
            >
              <span>Add "{{ searchQuery.trim() }}" to list</span>
              <span>
                <CheckIcon class="inline-block text-transparent" :size="16" />
              </span>
            </div>
          </ScrollArea>
          <EmptyComponent v-if="!searchQuery && filteredOptions.length === 0" />
        </PopoverContent>
      </Popover>
      <slot></slot>
    </div>
  </div>
</template>
