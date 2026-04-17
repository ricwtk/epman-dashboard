<script setup lang="ts">
import { ref } from 'vue'
import { BLOOM_TAXONOMY } from '@/constants'
import { CheckIcon } from 'lucide-vue-next'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'

const props = defineProps<{
  selected: string
  editing: boolean
}>()

const emit = defineEmits<{
  (e: 'select', domain: string, level: number): void;
}>()

const isPopoverOpen = ref(false)

function selectBtLevel(domain: string, level: number): void {
  emit('select', domain, level)
  isPopoverOpen.value = false
}
function isSelected(domain: string, level: number): boolean {
  return props.selected === `${domain.slice(0,1).toUpperCase()}${level}`
}
</script>

<template>
  <Popover :open="isPopoverOpen" @update:open="(val) => isPopoverOpen = editing ? val : false">
    <PopoverTrigger>
      <slot name="trigger">
        <Button variant="secondary">{{ selected }}</Button>
      </slot>
    </PopoverTrigger>
    <PopoverContent class="w-fit" v-if="editing">
      <ScrollArea class="h-60">
        <div class="flex flex-col gap-1 text-xs select-none">
          <div v-for="(taxon, taxonIndex) in BLOOM_TAXONOMY" :key="taxonIndex">
            <span class="font-bold">{{ taxon.domain }}</span>
            <div
              v-for="(level, levelIndex) in taxon.levels"
              :key="levelIndex"
              class="hover:bg-accent px-2 py-2 rounded flex gap-1"
              @click="selectBtLevel(taxon.domain, levelIndex + 1)"
            >
              <span class="font-semibold">{{ taxon.domain.slice(0,1).toUpperCase() }}{{ levelIndex + 1 }}</span>
              <span class="flex-1">{{ level }}</span>
              <span>
                <CheckIcon class="inline-block" :size="16"
                  :class="{ 'text-transparent': !isSelected(taxon.domain, levelIndex + 1) }"
                />
              </span>
            </div>
          </div>
        </div>
      </ScrollArea>
    </PopoverContent>
  </Popover>
</template>
