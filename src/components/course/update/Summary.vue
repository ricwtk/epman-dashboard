<script setup lang="ts">
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import MultiSelect from '@/components/multiselectwithfilter/MultiSelect.vue'
import { ref, computed } from 'vue'
import ResetButton from '@/components/ResetButton.vue'

import { getEditingCourseAndStore } from '@/composables/course'
const { course, editingCourseStore } = getEditingCourseAndStore()
const diffs = computed(() => {
  return Object.fromEntries(
    [
      'code',
      'name',
      'prerequisites',
      'lecturers',
      'category',
      'semester',
      'year',
      'credits',
      'synopsis',
      'transferableSkills',
      'deliveryMethods'
    ].map(
      (key) => [key, editingCourseStore.checkDiff([key])]
    )
  )
})
const resetDiff = (key: string) => {
  editingCourseStore.resetDiff([key])
}
</script>

<template>
  <div class="w-full flex flex-col gap-2">
    <div class="flex flex-col sm:flex-row gap-2">
      <div class="flex flex-col gap-1 grow">
        <Label for="code" class="h-8">Code <ResetButton v-if="diffs.code" @reset="resetDiff('code')" /></Label>
        <Input disabled id="code" placeholder="Course Code" v-model="course.code"/>
      </div>

      <div class="flex flex-col gap-1 grow">
        <Label for="name" class="h-8">Name <ResetButton v-if="diffs.name" @reset="resetDiff('name')" /></Label>
        <Input disabled id="name" placeholder="Course Name" v-model="course.name"/>
      </div>
    </div>
    <div class="flex flex-col sm:flex-row gap-2">
      <div class="flex flex-col gap-1 grow">
        <Label for="year" class="h-8">Year <ResetButton v-if="diffs.year" @reset="resetDiff('year')" /></Label>
        <Input id="year" type="number" placeholder="Offering Year" v-model="course.year"/>
      </div>

      <div class="flex flex-col gap-1 grow">
        <Label for="semester" class="h-8">Semester <ResetButton v-if="diffs.semester" @reset="resetDiff('semester')" /></Label>
        <Input id="semester" type="number" placeholder="Offering Semester" v-model="course.semester"/>
      </div>
    </div>
    <div class="flex flex-col gap-1 grow">
      <Label for="synopsis" class="h-8">Synopsis <ResetButton v-if="diffs.synopsis" @reset="resetDiff('synopsis')" /></Label>
      <Textarea id="synopsis" placeholder="Course Synopsis" v-model="course.synopsis"/>
    </div>
    <div class="flex flex-wrap gap-2">
      <div class="flex flex-col gap-1 grow min-w-75">
        <Label for="prerequisites" class="h-8">Prerequisites <ResetButton v-if="diffs.prerequisites" @reset="resetDiff('prerequisites')" /></Label>
        <MultiSelect
          input-id="prerequisites"
          label="Select Prerequisites"
          :options="['Option 1', 'Option 2', 'Option 3']"
          :selected="course.prerequisites"
          emptymessage="No Prerequisites"
        />
      </div>
      <div class="flex flex-col gap-1 grow min-w-75">
        <Label for="transferable" class="h-8">Transferable Skills <ResetButton v-if="diffs.transferableSkills" @reset="resetDiff('transferableSkills')" /></Label>
        <MultiSelect
          input-id="transferable"
          label="Select Transferable Skills"
          :options="['Option 1', 'Option 2', 'Option 3']"
          :selected="course.transferableSkills"
          emptymessage="No Transferable Skills"
        />
      </div>
      <div class="flex flex-col gap-1 grow min-w-75">
        <Label for="delivery" class="h-8">Delivery Methods <ResetButton v-if="diffs.deliveryMethods" @reset="resetDiff('deliveryMethods')" /></Label>
        <MultiSelect
          input-id="delivery"
          label="Select Delivery Method"
          :options="['Option 1', 'Option 2', 'Option 3']"
          :selected="course.deliveryMethods"
          emptymessage="No Delivery Methods"
        />
      </div>
    </div>

    <!-- <div class="flex flex-col gap-1 grow">
      <Label for="transferable">Transferable Skills</Label>
      <TagsInput v-model="transferablelist" id="transferable">
        <TagsInputItem v-for="item in transferablelist" :key="item" :value="item">
          <TagsInputItemText />
          <TagsInputItemDelete />
        </TagsInputItem>

        <TagsInputInput placeholder="Transferable Skills"/>
      </TagsInput>
    </div>
    <div class="flex flex-col gap-1 grow">
      <Label for="delivery">Delivery Methods</Label>
      <TagsInput v-model="deliverylist" id="delivery">
        <TagsInputItem v-for="item in deliverylist" :key="item" :value="item">
          <TagsInputItemText />
          <TagsInputItemDelete />
        </TagsInputItem>

        <TagsInputInput placeholder="Delivery Methods"/>
      </TagsInput>
    </div> -->
  </div>
</template>
