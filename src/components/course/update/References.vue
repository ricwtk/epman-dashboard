<script setup lang="ts">
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { ref, computed } from 'vue'
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
import ResetButton from '@/components/ResetButton.vue'

import { getEditingCourseAndStore } from '@/composables/course'
const { course, editingCourseStore } = getEditingCourseAndStore()

const diffs = computed(() => {
  return editingCourseStore.checkDiff(['references'])
})
const resetDiff = () => {
  editingCourseStore.resetDiff(['references'])
}

const addReference = () => {
  editingCourseStore.addReference()
}
const deleteReference = (index: number) => {
  editingCourseStore.deleteReference(index)
}
const moveReferenceUp = (index: number) => {
  editingCourseStore.moveReferenceUp(index)
}
const moveReferenceDown = (index: number) => {
  editingCourseStore.moveReferenceDown(index)
}

const referenceTypes = [
  { label: 'Main', value: 'main' },
  { label: 'Additional', value: 'additional' }
]
</script>

<template>
  <div class="flex flex-col gap-1">
    <div class="font-semibold flex flex-row items-center gap-1 h-9">
      References
      <ResetButton v-if="diffs" @reset="resetDiff()" />
    </div>
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
        <TableRow v-for="(reference, refIndex) in course.references" :key="refIndex">
          <TableCell class="w-14 text-center">
            <Button
              variant="destructive"
              @click="deleteReference(refIndex)"
            ><MinusIcon /></Button>
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
                @click="moveReferenceUp(refIndex)"
              ><ChevronUpIcon /></Button>
              <Button
                variant="secondary"
                :disabled="refIndex === course.references.length - 1"
                @click="moveReferenceDown(refIndex)"
              ><ChevronDownIcon /></Button>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <Button variant="default" @click="addReference"><PlusIcon /></Button>
  </div>
</template>
