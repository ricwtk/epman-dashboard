<script setup lang="ts">
import { ref, computed } from 'vue'
import { ListboxRoot, ListboxFilter, ListboxContent, ListboxItem, ListboxGroup } from 'reka-ui'
import { SearchIcon, PlusIcon, CheckIcon } from 'lucide-vue-next';

const props = defineProps<{
  inputId?: string;
  options: { label: string, value: string }[];
  selected: string[];
  allowAdd?: boolean;
}>();

const emits = defineEmits<{
  (e: "select" | "add", value: string): void;
}>();

const searchTerm = ref("");
const filteredOptions = computed(() => {
  return props.options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});
const emitAndClear = (emitKey: "select" | "add", value: string) => {
  emits(emitKey, value)
  searchTerm.value = ""
}
</script>

<template>
  <ListboxRoot
    class="border border-border max-h-[30ex] bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md"
  >
    <div
      class="flex h-9 items-center gap-2 border-b px-3"
    >
      <SearchIcon class="size-4 shrink-0 opacity-50" />
      <ListboxFilter
        v-model="searchTerm"
        auto-focus
        placeholder="Search..."
        class="placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
    <ListboxContent
      class="max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto"
    >
      <ListboxItem
        value="persistent-add-button"
        v-if="searchTerm.length > 0 && allowAdd"
        @select="emitAndClear('add', searchTerm)"
        class="flex justify-between data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground [&_svg:not([class*=\'text-\'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4"
      >
        <PlusIcon class="mr-2 h-4 w-4" />
        Add "{{ searchTerm }}" to list
      </ListboxItem>
      <ListboxItem
        v-for="option in filteredOptions"
        :key="option.value"
        :value="option.value"
        @select="emitAndClear('select', option.value)"
        :id="option.value"
        class="flex justify-between data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground [&_svg:not([class*=\'text-\'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4"
      >
        {{ option.label }}
        <CheckIcon v-if="selected.includes(option.value)" />
      </ListboxItem>
    </ListboxContent>
  </ListboxRoot>
</template>
