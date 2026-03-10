<script setup lang="ts">
import ContentItemBadges from '../contentcard/ContentItemBadges.vue'
import AddOrSelect from './AddOrSelect.vue'

defineProps<{
  inputId?: string;
  label: string;
  options: { label: string, value: string }[];
  selected: string[];
  emptymessage?: string;
  allowAdd?: boolean;
}>()

defineEmits<{
  (e: "delete", value: string): void;
  (e: "select", value: string): void;
  (e: "add", value: string): void;
}>()
</script>

<template>
  <div class="flex flex-wrap gap-1 items-center">
    <ContentItemBadges
      :badges="selected || []"
      :elsemessage="emptymessage"
      :editable="true"
      @delete="(ev) => $emit('delete', ev)"
    >
    </ContentItemBadges>

    <AddOrSelect
      :allow-add="allowAdd"
      :inputId="inputId"
      :options="options"
      :selected="selected"
      @select="$emit('select', $event)"
      @add="$emit('add', $event)"
    />
  </div>
</template>
