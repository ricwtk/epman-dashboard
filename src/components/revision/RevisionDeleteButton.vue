<script setup lang="ts">
import { ref } from 'vue';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const emits = defineEmits(['delete']);

const isPopoverOpen = ref(false);
const deleteRevision = () => {
  isPopoverOpen.value = false;
  emits('delete');
}
</script>

<template>
  <Popover v-model:open="isPopoverOpen">
    <PopoverTrigger>
      <Button variant="destructive" size="sm">Delete current revision</Button>
    </PopoverTrigger>
    <PopoverContent>
      <div class="flex flex-col space-y-2">
        <p>Are you sure you want to delete this revision?</p>
        <div class="flex justify-end space-x-2">
          <Button variant="outline" size="sm" @click="isPopoverOpen = false">Cancel</Button>
          <Button variant="destructive" size="sm" @click="deleteRevision">Delete</Button>
        </div>
      </div>
    </PopoverContent>
  </Popover>
</template>
