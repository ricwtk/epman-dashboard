<script setup lang="ts">
import { ref, computed } from 'vue'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import MultiSelect from '@/components/multiselectwithfilter/MultiSelect.vue'
import ResetButton from '@/components/ResetButton.vue'
import { Field } from '@/components/ui/field'
import { NumberField, NumberFieldContent, NumberFieldInput } from '@/components/ui/number-field'

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
      <Field class="gap-1">
        <Label for="code">
          Code
          <ResetButton :disabled="!diffs.code" @reset="resetDiff('code')" />
        </Label>
        <Input disabled id="code" placeholder="Course Code" v-model="course.code"/>
      </Field>

      <Field class="gap-1">
        <Label for="name">
          Name
          <ResetButton :disabled="!diffs.name" @reset="resetDiff('name')" />
        </Label>
        <Input id="name" placeholder="Course Name" v-model="course.name"/>
      </Field>

      <NumberField id="credits" v-model="course.credits" class="gap-1" :min="0">
        <Label for="credits">
          Credits
          <ResetButton :disabled="!diffs.credits" @reset="resetDiff('credits')" />
        </Label>
        <NumberFieldContent>
          <NumberFieldInput />
        </NumberFieldContent>
      </NumberField>
    </div>
    <div class="flex flex-col sm:flex-row gap-2">
      <NumberField id="year" v-model="course.year" class="gap-1 grow" :min="0">
      <!-- <Field class="gap-1"> -->
        <Label for="year">
          Year
          <ResetButton :disabled="!diffs.year" @reset="resetDiff('year')" />
        </Label>
        <!-- <Input id="year" type="number" placeholder="Offering Year" v-model="course.year"/> -->
        <NumberFieldContent>
          <NumberFieldInput />
        </NumberFieldContent>
      </NumberField>

      <NumberField id="semester" v-model="course.semester" class="gap-1 grow" :min="0">
      <!-- <Field class="gap-1"> -->
        <Label for="semester">
          Semester
          <ResetButton :disabled="!diffs.semester" @reset="resetDiff('semester')" />
        </Label>
        <!-- <Input id="semester" type="number" placeholder="Offering Semester" v-model="course.semester"/> -->
        <NumberFieldContent>
          <NumberFieldInput />
        </NumberFieldContent>
      </NumberField>
    </div>
    <Field class="gap-1">
      <Label for="synopsis">
        Synopsis
        <ResetButton :disabled="!diffs.synopsis" @reset="resetDiff('synopsis')" />
      </Label>
      <Textarea id="synopsis" placeholder="Course Synopsis" v-model="course.synopsis"/>
    </Field>
    <!-- <div class="flex flex-wrap gap-2"> -->
    <div class="flex flex-col sm:flex-row gap-2">
      <!-- <div class="flex flex-col gap-1 grow min-w-75"> -->
      <Field class="gap-1">
        <Label for="prerequisites">
          Prerequisites
          <ResetButton :disabled="!diffs.prerequisites" @reset="resetDiff('prerequisites')" />
        </Label>
        <MultiSelect
          input-id="prerequisites"
          label="Select Prerequisites"
          :options="['Option 1', 'Option 2', 'Option 3']"
          :selected="course.prerequisites"
          emptymessage="No Prerequisites"
        />
      </Field>
      <!-- <div class="flex flex-col gap-1 grow min-w-75"> -->
      <Field class="gap-1">
        <Label for="transferable">
          Transferable Skills
          <ResetButton :disabled="!diffs.transferableSkills" @reset="resetDiff('transferableSkills')" />
        </Label>
        <MultiSelect
          input-id="transferable"
          label="Select Transferable Skills"
          :options="['Option 1', 'Option 2', 'Option 3']"
          :selected="course.transferableSkills"
          emptymessage="No Transferable Skills"
        />
      </Field>
      <Field class="gap-1">
        <Label for="delivery">
          Delivery Methods
          <ResetButton :disabled="!diffs.deliveryMethods" @reset="resetDiff('deliveryMethods')" />
        </Label>
        <MultiSelect
          input-id="delivery"
          label="Select Delivery Method"
          :options="['Option 1', 'Option 2', 'Option 3']"
          :selected="course.deliveryMethods"
          emptymessage="No Delivery Methods"
        />
      </Field>
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
