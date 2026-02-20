<script setup lang="ts">
interface Props {
  options: { title: string; description: string }[];
  disabled?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
});

const model = defineModel<number>({
  default: 1,
  required: true,
});

import { CheckIcon, XIcon } from 'lucide-vue-next';
import { Stepper, StepperItem, StepperTrigger, StepperIndicator, StepperSeparator, StepperTitle, StepperDescription } from '@/components/ui/stepper';
</script>

<template>
  <Stepper v-model="model" :linear="false">
    <StepperItem
      v-for="option,optIndex in props.options"
      :key="option.title" :step="optIndex+1"
      class="w-full relative flex flex-col items-center justify-center"
    >
      <StepperTrigger :disabled="props.disabled">
        <StepperIndicator class="group-data-[state=completed]:bg-primary group-data-[state=completed]:text-primary-foreground">
          <CheckIcon v-if="!(model! < optIndex+1)"/>
          <XIcon v-else/>
        </StepperIndicator>
      </StepperTrigger>
      <StepperSeparator
        v-if="optIndex < props.options.length-1"
        class="absolute left-[calc(50%+20px)] right-[calc(-50%+10px)] top-5 block h-0.5 shrink-0 rounded-full bg-muted group-data-[state=completed]:bg-primary"
      />
      <StepperTrigger :disabled="props.disabled">
        <div class="flex flex-col items-center">
          <StepperTitle>{{ option.title }}</StepperTitle>
          <StepperDescription>{{ option.description }}</StepperDescription>
        </div>
      </StepperTrigger>
    </StepperItem>
  </Stepper>
</template>
