<script setup lang="ts">
import { PenIcon } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
interface Props {
  editable: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  editable: true,
});
</script>

<template>
  <div class="plaincard flex flex-col px-3">
    <div class="flex flex-row items-center">
      <div class="grow font-bold">
        <slot name="title"></slot>
      </div>
      <Button variant="ghost" size="icon" v-if="editable">
        <PenIcon />
      </Button>
    </div>
    <div class="">
      <slot name="body"></slot>
    </div>
    <div class="">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
