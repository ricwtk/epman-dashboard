<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';

const props = defineProps<{
  code: string,
  name: string,
  credits: number,
}>();

const cliroot = useTemplateRef<HTMLDivElement>('cliroot');

const emits = defineEmits<{
  (e: 'drag-start', event: DragEvent): void;
  (e: 'drag-end', event: DragEvent): void;
  (e: 'item-drop', event: DragEvent, zone: 'top'|'bottom'|null): void;
  (e: 'drag-over', event: DragEvent): void;
}>()

const onDragStart = (event: DragEvent) => {
  // cliroot.value?.classList.add('hidden');
  emits('drag-start', event);
};
const onDragEnd = (event: DragEvent) => {
  // cliroot.value?.classList.remove('hidden');
  // dropZone.value = null;
  emits('drag-end', event);
};
const onDragOver = (event: DragEvent) => {
  event.preventDefault();

  if (cliroot.value) {
    const bounding = cliroot.value.getBoundingClientRect();
    // const bounding = (event.target as HTMLElement).getBoundingClientRect();
    const offset = bounding.y + bounding.height / 2;

    if (event.clientY - offset > 5) {
      dropZone.value = 'bottom';
    } else if (event.clientY - offset < -5) {
      dropZone.value = 'top';
    }
  }
  emits('drag-over', event);
};
const onDrop = (event: DragEvent) => {
  // console.log(event.dataTransfer!.getData('text/plain'))
  emits('item-drop', event, dropZone.value);
  // console.log(event, dropZone.value)
  dropZone.value = null;
};
const onDragLeave = () => {
  dropZone.value = null;
};

const dropZone = ref<'top' | 'bottom' | null>(null);
const targetIndex = ref<number | null>(null);
</script>

<template>
  <div ref="cliroot"
    class="flex flex-col gap-1 text-xs course-list-item"
    draggable="true"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
    @dragover="onDragOver"
    @drop="onDrop"
    @dragleave="onDragLeave"
  >
    <div class="drop-indicator top" :class="{ 'visible': dropZone === 'top' }"></div>
    <div class="">{{ code }}</div>
    <div class="truncate" :title="name">{{ name }}</div>
    <div class="">{{ credits }}</div>
    <div class="drop-indicator bottom" :class="{ 'visible': dropZone === 'bottom' }"></div>
  </div>
</template>

<style scoped>
.drop-indicator {
  width: 100%;
  height: 4px;
  background-color: #42b983;
  display: none;
}

/*.drop-indicator.top { top: 0; }
.drop-indicator.bottom { bottom: 0; }*/
.drop-indicator.visible { display: block; }
</style>
