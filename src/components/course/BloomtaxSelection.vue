<script setup lang="ts">
import { ref, watch } from 'vue'
import { BLOOM_TAXONOMY } from '@/constants'
import { CheckIcon } from 'lucide-vue-next'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

const props = defineProps<{
  selected: string
  editing: boolean
}>()

const emit = defineEmits<{
  (e: 'select', domain: string, level: number): void;
}>()

const isPopoverOpen = ref(false)
const currentTab = ref(BLOOM_TAXONOMY[0]!.domain)
watch(() => isPopoverOpen.value, (val) => {
  if (val) {
    const selectedDomainInitial = props.selected.slice(0, 1).toLowerCase()
    currentTab.value = BLOOM_TAXONOMY.find(taxon => taxon.domain.toLowerCase().startsWith(selectedDomainInitial))?.domain ?? BLOOM_TAXONOMY[0]!.domain
  }
})
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
      <Tabs v-model="currentTab">
        <TabsList>
          <TabsTrigger v-for="(taxon, taxonIndex) in BLOOM_TAXONOMY" :key="`taxon-domain-${taxonIndex}`" :value="taxon.domain">
            <span class="text-xs font-bold">{{ taxon.domain }}</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent v-for="(taxon, taxonIndex) in BLOOM_TAXONOMY" :key="`taxon-content-${taxonIndex}`" :value="taxon.domain">
          <div class="flex flex-col gap-1 text-xs select-none">
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
        </TabsContent>
      </Tabs>
    </PopoverContent>
  </Popover>
</template>
