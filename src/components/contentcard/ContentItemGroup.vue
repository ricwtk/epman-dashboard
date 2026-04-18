<script setup lang="ts">
import { ButtonGroup, ButtonGroupText } from '@/components/ui/button-group';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CheckIcon, CircleChevronDownIcon } from 'lucide-vue-next';

const props = defineProps<{
  title?: string,
  selected: Array<{ label: string, value: string | number }>
  editing?: boolean,
  options?: Array<Array<{ label: string, value: string | number }>>
}>();
const emit = defineEmits<{
  (e: 'update:selected', value: Array<string | number>): void
}>();
const selectOption = (itemIndex: number, option: { label: string, value: string | number }) => {
  let newSelected = props.selected.map(s => s.value)
  newSelected[itemIndex] = option.value;
  emit('update:selected', newSelected);
};
</script>

<template>
  <div>
    <div class="content-item-title" v-if="title">{{ title }}</div>
    <div class="flex flex-wrap gap-1">
      <ButtonGroup class="gap-0!">
        <template v-for="(item, itemIndex) in selected" :key="item.label">
          <Popover>
            <PopoverTrigger as-child>
              <ButtonGroupText class="border-0 rounded-full text-xs py-0.5">
                {{ item.label }}
                <span v-if="editing"><CircleChevronDownIcon :size="14"/></span>
              </ButtonGroupText>
            </PopoverTrigger>
            <PopoverContent v-if="options && options[itemIndex]" class="text-xs w-fit">
              <div v-for="option in options[itemIndex]"
                :key="option.label"
                class="px-2 py-2 hover:bg-accent rounded w-full flex justify-between items-center gap-2"
                @click="() => selectOption(itemIndex, option)"
              >
                <span>{{ option.label }}</span>
                <span>
                  <CheckIcon class="inline-block" :size="16"
                    :class="{ 'text-transparent': !(selected[itemIndex] && selected[itemIndex].value && selected[itemIndex].value === option.value) }"
                  />
                </span>
              </div>
            </PopoverContent>
          </Popover>
        </template>
      </ButtonGroup>
    </div>
  </div>
</template>
