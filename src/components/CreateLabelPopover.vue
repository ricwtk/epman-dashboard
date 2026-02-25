<script setup lang="ts">
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-vue-next';
import { ref, watch } from 'vue';

const props = defineProps<{
  currentList: string[]
}>()
const isPopoverOpen = ref(false)
const newLabel = ref("")
const newError = ref("")

watch(newLabel, (oldValue, newValue) => {
  if (props.currentList.includes(oldValue)) {
    newError.value = 'Label already exists';
  } else {
    newError.value = '';
  }
});

const emits = defineEmits<{
  (e: 'create', label: string): void
}>()
const createNew = () => {
  emits('create', newLabel.value);
  isPopoverOpen.value = false;
  newLabel.value = '';
}
</script>

<template>
  <Popover v-model:open="isPopoverOpen">
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        size="icon"
      >
        <PlusIcon />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-80">
      <div class="grid gap-4">
        <div class="space-y-2">
          <h4 class="font-medium leading-none">
            <slot name="title">New</slot>
          </h4>
          <p class="text-sm text-muted-foreground">
            <slot name="description">Create new</slot>
          </p>
        </div>
        <form class="grid gap-2">
          <div class="grid grid-cols-3 items-center gap-4">
            <Label for="label">Label</Label>
            <Input :variant="newError !== '' ? 'error' : 'default'"
              id="label"
              class="col-span-2 h-8"
              v-model="newLabel"
            />
          </div>
          <div class="grid grid-cols-3 items-center gap-4" v-if="newError !== ''">
            <div></div>
            <div class="col-span-2 text-sm text-red-500">
              {{ newError }} <slot name="error" :label="newLabel"></slot>
            </div>
          </div>

          <Button @click="createNew"
            :disabled="newError !== '' || newLabel === ''"
          >
              <PlusIcon/>Create
          </Button>
        </form>
      </div>
    </PopoverContent>
  </Popover>
</template>
