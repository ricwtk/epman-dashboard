<script setup lang='ts'>
import { ref } from 'vue';
import { Badge } from '@/components/ui/badge';
import BadgeList from '@/components/BadgeList.vue';
import { CheckIcon, CircleChevronDownIcon } from 'lucide-vue-next';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

defineProps<{
  title?: string,
  selected: { label: string; value: string },
  elsemessage?: string,
  editing?: boolean,
  options?: Array<{ label: string; value: string }>
}>();
const emit = defineEmits<{
  (e: "delete", value: string): void
  (e: "select", value: { label: string; value: string }): void
}>();
const isPopoverOpen = ref(false);
const selectOption = (option: { label: string; value: string }) => {
  emit("select", option);
  isPopoverOpen.value = false;
};
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
        <PopoverContent class="text-xs">
          <div v-for="option in options"
            :key="option.value"
            class="px-2 py-2 hover:bg-accent rounded w-full flex justify-between items-center"
            @click="() => selectOption(option)"
          >
            <span>{{ option.label }}</span>
            <span>
              <CheckIcon class="inline-block" :size="16"
                :class="{ 'text-transparent': !(selected.value && selected.value === option.value) }"
              />
            </span>
          </div>
        </PopoverContent>
      </Popover>

      <Badge v-if="!selected.value" variant="outline">{{ elsemessage }}</Badge>
      <slot></slot>
    </div>
  </div>
</template>
