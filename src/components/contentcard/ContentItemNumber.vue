<script setup lang='ts'>
import { Badge } from '@/components/ui/badge';
import { MinusIcon, PlusIcon } from 'lucide-vue-next';

const props = defineProps<{
  title?: string,
  modelValue: number,
  editing?: boolean,
  min?: number,
  max?: number,
}>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void;
}>();
const checkAndUpdateModelValue = (val: number) => {
  if (props.min !== undefined && val < props.min) val = props.min;
  if (props.max !== undefined && val > props.max) val = props.max;
  emit('update:modelValue', Math.round(val));
};
const inputModelValue = (ev: Event) => {
  const target = ev.target as HTMLInputElement;
  const val = target.value;
  let parsedVal = parseFloat(val);
  if (isNaN(parsedVal)) return;
  checkAndUpdateModelValue(parsedVal);
};

const addToModelValue = (val: number) => {
  let parsedVal = props.modelValue + val;
  checkAndUpdateModelValue(parsedVal);
};
</script>

<template>
  <div>
    <div class="content-item-title" v-if="title">{{ title }}</div>
    <div class="flex flex-wrap gap-1">
      <Badge variant="secondary" class="text-center w-15" v-if="!editing">{{ modelValue }}</Badge>
      <Badge variant="secondary" v-else>
        <span @click="addToModelValue(-1)"><MinusIcon :size="12" /></span>
        <input
          :value="modelValue"
          @input="inputModelValue"
          class="focus:outline-none w-15 text-center"
        />
        <span @click="addToModelValue(1)"><PlusIcon :size="14"/></span>
      </Badge>
    </div>
  </div>
</template>
