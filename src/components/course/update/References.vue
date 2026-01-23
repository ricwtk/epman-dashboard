<script setup lang="ts">
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { ref } from 'vue'
import { type Reference } from '@/types/course'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHeader,
  TableHead
} from '@/components/ui/table'
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
  <div class="flex flex-col gap-1">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead></TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Description</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="(reference, refIndex) in references" :key="refIndex">
          <TableCell class="w-14 text-center">
            <Button variant="destructive" @click="console.log(`Deleting reference ${refIndex}`)"><MinusIcon /></Button>
          </TableCell>
          <TableCell class="w-30 ">
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
          </TableCell>
          <TableCell class="">
            <Textarea v-model="reference.description" />
          </TableCell>
          <TableCell class="w-14 text-center">
            <div class="flex flex-col gap-1">
              <Button
                variant="secondary"
                :disabled="refIndex === 0"
                @click="console.log(`Move up ${refIndex}`)"
              ><ChevronUpIcon /></Button>
              <Button
                variant="secondary"
                :disabled="refIndex === references.length - 1"
                @click="console.log(`Move down ${refIndex}`)"
              ><ChevronDownIcon /></Button>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <Button variant="default"><PlusIcon /></Button>
  </div>
</template>
