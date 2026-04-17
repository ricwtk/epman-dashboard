<script setup lang='ts'>
import { ref } from 'vue';
import { Badge } from '@/components/ui/badge';
import BadgeList from '@/components/BadgeList.vue';
import { CircleChevronDownIcon } from 'lucide-vue-next';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

defineProps<{
  title?: string,
  selected: { label: string; key: string },
  elsemessage?: string,
  editing?: boolean,
  options?: Array<{ label: string; key: string }>
}>();
defineEmits<{
  (e: "delete", value: string): void
}>();
const isPopoverOpen = ref(false);
</script>

<template>
  <div v-if="selected || elsemessage">
    <div class="content-item-title" v-if="title">{{ title }}</div>
    <div class="flex flex-wrap gap-1">
      <Popover :open="isPopoverOpen" @update:open="(val) => isPopoverOpen = editing ? val : false">
        <PopoverTrigger as-child>
          <BadgeList
            class="flex-wrap flex-row"
            :editing="editing"
            :items="[selected.label]"
          >
            <template #editIcon>
              <CircleChevronDownIcon :size="14"/>
            </template>
          </BadgeList>
        </PopoverTrigger>
        <PopoverContent>
          <div class="flex flex-wrap gap-1">
            <Badge v-for="option in options" :key="option.key" variant="outline">{{ option.label }}</Badge>
          </div>
        </PopoverContent>
      </Popover>

      <Badge v-if="!selected.key" variant="outline">{{ elsemessage }}</Badge>
      <slot></slot>
    </div>
  </div>
</template>
