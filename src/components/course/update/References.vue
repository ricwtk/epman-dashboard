<script setup lang="ts">
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { ref } from 'vue'
import { type Reference } from '@/lib/course'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ChevronUpIcon, ChevronDownIcon, MinusIcon, PlusIcon } from 'lucide-vue-next'

const referenceTypes = [
  { label: 'Main', value: 'main' },
  { label: 'Additional', value: 'additional' }
]

const references = ref<Reference[]>([
  { description: "Introduction to Programming Using Python", label: "main" },
  { description: "Programming Using Python", label: "additional" },
  { description: "Programming Using Python 2", label: "additional" },
  { description: "Programming Using Python 3", label: "additional" },
])
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex flex-col gap-1" v-for="(reference, refIndex) in references">
      <Select v-model="reference.label">
        <SelectTrigger class="w-full">
          <SelectValue placeholder="Select a label" />
        </SelectTrigger>
        <SelectContent>
            <SelectItem v-for="(referenceType, index) in referenceTypes"
              :value="referenceType.value"
              :key="index"
            >
              {{ referenceType.label }}
            </SelectItem>
        </SelectContent>
      </Select>
      <Textarea v-model="reference.description" />
      <div class="flex flex-row gap-1">
        <Button variant="secondary" :disabled="refIndex === 0"><ChevronUpIcon /></Button>
        <Button variant="secondary" :disabled="refIndex === references.length - 1"><ChevronDownIcon /></Button>
        <div class="grow"></div>
        <Button variant="destructive"><MinusIcon /></Button>
      </div>
    </div>
    <Button variant="default"><PlusIcon /></Button>
  </div>
</template>
