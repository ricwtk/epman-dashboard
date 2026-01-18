<script setup lang="ts">
import { PenIcon, CheckIcon } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { ref } from 'vue';
interface Props {
  editable: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  editable: true,
});
const editing = ref(false);
</script>

<template>
  <div class="card-structure flex flex-col px-3">
    <div class="card-structure-header">
      <div class="card-structure-title">
        <slot name="title"></slot>
      </div>
      <div class="grow"></div>
      <div class="card-structure-button">
        <Button variant="ghost" size="icon" v-if="editable" @click="editing = !editing">
          <PenIcon v-if="!editing" />
          <CheckIcon v-else />
        </Button>
      </div>
    </div>
    <div class="card-structure-body">
      <slot name="body" :editing="editing"></slot>
    </div>
  </div>
</template>

<style scoped>
@reference '@/assets/base.css';

.card-structure {
  @apply rounded-md m-2 px-0;
  .card-structure-header {
    @apply font-bold flex flex-row items-stretch mb-1;
    .card-structure-title {
      @apply bg-card font-bold py-2 px-4 rounded-md border-border border truncate mr-1 shadow-md;
    }
    .card-structure-button {
      @apply flex flex-row items-center justify-center;
    }
  }
  .card-structure-body {
    @apply py-2 px-4 bg-card rounded-md border-border border shadow-md;
  }
}
</style>
