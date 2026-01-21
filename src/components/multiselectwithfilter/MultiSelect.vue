<script setup lang="ts">
import { ref } from 'vue'
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from '@/components/ui/popover'
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import ContentItemBadges from '../contentcard/ContentItemBadges.vue'
import { Button } from '@/components/ui/button'
import { CheckIcon } from 'lucide-vue-next'

defineProps<{
  inputId?: string;
  label: string;
  options: string[];
  selected: string[];
  emptymessage?: string;
}>()
</script>

<template>
  <!-- <div class="flex flex-wrap">
    <ContentItemBadges
      :badges="selected || []"
      :elsemessage="emptymessage"
    />
  </div> -->
  <Command class="max-h-[20ex] border border-border">
    <div class="flex flex-col p-2">
      <div class="flex flex-wrap">
        <ContentItemBadges
          :badges="selected || []"
          :elsemessage="emptymessage"
        />
      </div>
      <CommandInput :id="inputId" placeholder="Search..." />
    </div>
    <CommandList>
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandGroup>
        <CommandItem
          v-for="option in options"
          :key="option"
          :value="option"
          class="flex justify-between"
        >
          {{ option }}
          <CheckIcon v-if="selected.includes(option)" />
        </CommandItem>
      </CommandGroup>
    </CommandList>
  </Command>
</template>
