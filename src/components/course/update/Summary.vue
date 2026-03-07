<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import MultiSelect from '@/components/multiselectwithfilter/MultiSelect.vue'
import ResetButton from '@/components/ResetButton.vue'
import { Field } from '@/components/ui/field'
import { NumberField, NumberFieldContent, NumberFieldInput } from '@/components/ui/number-field'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { useCourseStore } from '@/stores/course'
import type { CourseType } from '@/types/course'
import { COURSE_TYPES } from '@/constants'
const courseStore = useCourseStore()
const { draft } = storeToRefs(courseStore)

// import { getEditingCourseAndStore } from '@/composables/course'
// const { course, editingCourseStore } = getEditingCourseAndStore()
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
      (key) => [key, courseStore.checkDiff([key])]
    )
  )
})
const resetDiff = (key: string) => {
  courseStore.resetDiff([key])
}
</script>

<template>
  <div class="w-full flex flex-col gap-2">
    <div class="flex flex-col sm:flex-row gap-2">
      <Field class="gap-1 flex-1">
        <Label for="code">
          Code
          <ResetButton :disabled="!diffs.code" @reset="resetDiff('code')" />
        </Label>
        <Input disabled id="code" placeholder="Course Code" v-model="draft.code"/>
      </Field>

      <Field class="gap-1 flex-1">
        <Label for="name">
          Name
          <ResetButton :disabled="!diffs.name" @reset="resetDiff('name')" />
        </Label>
        <Input id="name" placeholder="Course Name" v-model="draft.name"/>
      </Field>

      <NumberField id="credits" v-model="draft.credits" class="gap-1 flex-1" :min="0">
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
      <NumberField id="year" v-model="draft.year" class="gap-1 flex-1 grow" :min="0">
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

      <NumberField id="semester" v-model="draft.semester" class="gap-1 flex-1 grow" :min="0">
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

      <Field class="gap-1 flex-1">
        <Label for="category">
          Category
          <ResetButton :disabled="!diffs.category" @reset="resetDiff('category')" />
        </Label>
        <Select :modelValue="draft.category" @update:modelValue="(value) => draft.category = value as CourseType">
          <SelectTrigger class="grow">
            <SelectValue placeholder="Select"/>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup v-for="(courseType, index) in COURSE_TYPES" :key="index">
              <SelectItem :value="courseType.key">{{ courseType.label }}</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
    </div>
    <Field class="gap-1">
      <Label for="synopsis">
        Synopsis
        <ResetButton :disabled="!diffs.synopsis" @reset="resetDiff('synopsis')" />
      </Label>
      <Textarea id="synopsis" placeholder="Course Synopsis" v-model="draft.synopsis"/>
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
          :selected="draft.prerequisites"
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
          :selected="draft.transferableSkills"
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
          :selected="draft.deliveryMethods"
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
