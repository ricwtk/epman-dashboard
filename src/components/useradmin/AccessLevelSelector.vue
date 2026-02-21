<script setup lang="ts">
interface Props {
  options: { title: string; description: string }[];
  disabled?: boolean;
  size?: 'default' | 'small';
};

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  size: 'default'
});

const model = defineModel<number>({
  default: 1,
  required: true,
});

import { CheckIcon, XIcon } from 'lucide-vue-next';
import { Stepper, StepperItem, StepperTrigger, StepperIndicator, StepperSeparator, StepperTitle, StepperDescription } from '@/components/ui/stepper';
</script>

<template>
  <Stepper v-model="model" :linear="false" class="gap-0">
    <StepperItem
      v-for="option,optIndex in props.options"
      :key="option.title" :step="optIndex+1"
      class="w-full relative flex flex-col items-center justify-center"
    >
      <StepperTrigger :disabled="props.disabled">
        <StepperIndicator class="group-data-[state=completed]:bg-primary group-data-[state=completed]:text-primary-foreground"
          :class="{
            'w-4 h-4': props.size === 'small',
            'w-8 h-8': props.size === 'default',
            'opacity-70': props.disabled
          }"
        >
          <CheckIcon v-if="!(model! < optIndex+1)" :size="props.size === 'small' ? 12 : 16"/>
          <XIcon v-else :size="props.size === 'small' ? 12 : 16"/>
        </StepperIndicator>
      </StepperTrigger>
      <!-- <StepperSeparator
        v-if="optIndex < props.options.length-1"
        class="absolute top-5 block h-0.5 shrink-0 rounded-full bg-muted group-data-[state=completed]:bg-primary"
        :class="{
          'top-3 left-[calc(50%+12px+1px)] right-[calc(-50%+6px+1px)]': props.size === 'small',
          'top-5 left-[calc(50%+16px+4px)] right-[calc(-50%+8px+4px)]': props.size === 'default',
        }"
      /> -->
      <StepperSeparator
        v-if="optIndex < props.options.length-1"
        class="absolute top-5 block h-0.5 shrink-0 rounded-full bg-muted"
        :class="{
          'top-3 left-[calc(50%+12px+1px)] right-0': props.size === 'small',
          'top-5 left-[calc(50%+16px+4px)] right-0': props.size === 'default',
          'bg-primary!': model-1 > optIndex,
          'opacity-70': props.disabled
        }"
      />
      <StepperSeparator
        v-if="optIndex > 0"
        class="absolute top-5 block h-0.5 shrink-0 rounded-full bg-muted"
        :class="{
          'top-3 left-0 right-[calc(50%+12px+1px)]': props.size === 'small',
          'top-5 left-0 right-[calc(50%+16px+4px)]': props.size === 'default',
          'bg-primary!': model > optIndex,
          'opacity-70': props.disabled
        }"
      />
      <StepperTrigger :disabled="props.disabled">
        <div class="flex flex-col items-center">
          <StepperTitle :class="{
            'text-xs': props.size === 'small',
            'opacity-80': props.disabled
          }">{{ option.title }}</StepperTitle>
          <StepperDescription v-if="props.size !== 'small'"
            :class="{
              'opacity-80': props.disabled
          }">{{ option.description }}</StepperDescription>
        </div>
      </StepperTrigger>
    </StepperItem>
  </Stepper>
</template>
