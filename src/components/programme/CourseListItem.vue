<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  code: string,
  name: string,
  credits: number,
}>();

const emits = defineEmits<{
  (e: 'onDragStart', event: DragEvent): void;
  (e: 'onDragEnd'): void;
  (e: 'onDrop', event: DragEvent): void;
  (e: 'onDragOver', event: DragEvent): void;
}>()

const onDragStart = (event: DragEvent) => {
  emits('onDragStart', event);
  const el = event.target as HTMLElement;
  requestAnimationFrame(() => {
    el!.classList.add('hidden');
  });
};
const onDragEnd = () => {
  emits('onDragEnd');
  document.querySelectorAll('.course-list-item').forEach(el => {
    el.classList.remove('hidden');
  });
  dropZone.value = null;
};
const onDragOver = (event: DragEvent) => {
  event.preventDefault();

  const bounding = (event.target as HTMLElement).getBoundingClientRect();
  const offset = bounding.y + bounding.height / 2;

  if (event.clientY - offset > 0) {
    dropZone.value = 'bottom';
  } else {
    dropZone.value = 'top';
  }
  emits('onDragOver', event);
};
const onDrop = (event: DragEvent) => {
  emits('onDrop', event);
  dropZone.value = null;
};
const onDragLeave = () => dropZone.value = null;

const dropZone = ref<'top' | 'bottom' | null>(null);
const targetIndex = ref<number | null>(null);
</script>

<template>
  <div class="flex flex-col gap-1 text-xs course-list-item"
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
