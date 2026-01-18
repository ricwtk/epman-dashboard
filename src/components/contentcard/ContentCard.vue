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
  <div class="card-structure flex flex-col px-3">
    <div class="card-structure-header">
      <div class="card-structure-title">
        <slot name="title"></slot>
      </div>
      <div class="grow"></div>
      <div class="card-structure-button">
        <Button variant="ghost" size="icon" v-if="editable">
          <PenIcon />
        </Button>
      </div>
    </div>
    <div class="card-structure-body">
      <slot name="body"></slot>
    </div>
  </div>
</template>
