<script setup lang="ts">
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import MultiSelect from '@/components/multiselectwithfilter/MultiSelect.vue'
import { ref } from 'vue'

const prereqlist = ref<string[]>(['Option 1', 'Option 2'])
const transferablelist = ref<string[]>(['abcdef', 'ghijkl'])
const deliverylist = ref<string[]>(['abcdef', 'ghijkl'])
</script>

<template>
  <div class="w-full flex flex-col gap-2">
    <div class="flex flex-col sm:flex-row gap-2">
      <div class="flex flex-col gap-1 grow">
        <Label for="code">Code</Label>
        <Input disabled id="code" placeholder="Course Code"/>
      </div>

      <div class="flex flex-col gap-1 grow">
        <Label for="name">Name</Label>
        <Input disabled id="name" placeholder="Course Name"/>
      </div>
    </div>
    <div class="flex flex-col sm:flex-row gap-2">
      <div class="flex flex-col gap-1 grow">
        <Label for="year">Year</Label>
        <Input id="year" placeholder="Offering Year"/>
      </div>

      <div class="flex flex-col gap-1 grow">
        <Label for="semester">Semester</Label>
        <Input id="semester" placeholder="Offering Semester"/>
      </div>
    </div>
    <div class="flex flex-col gap-1 grow">
      <Label for="description">Description</Label>
      <Textarea id="description" placeholder="Course Description"/>
    </div>
    <div class="flex flex-wrap gap-2">
      <div class="flex flex-col gap-1 grow min-w-75">
        <Label for="prerequisites">Prerequisites</Label>
        <MultiSelect
          input-id="prerequisites"
          label="Select Prerequisites"
          :options="['Option 1', 'Option 2', 'Option 3']"
          :selected="prereqlist"
          emptymessage="No Prerequisites"
        />
      </div>
      <div class="flex flex-col gap-1 grow min-w-75">
        <Label for="transferable">Transferable Skills</Label>
        <MultiSelect
          input-id="transferable"
          label="Select Transferable Skills"
          :options="['Option 1', 'Option 2', 'Option 3']"
          :selected="transferablelist"
          emptymessage="No Transferable Skills"
        />
      </div>
      <div class="flex flex-col gap-1 grow min-w-75">
        <Label for="delivery">Delivery Methods</Label>
        <MultiSelect
          input-id="delivery"
          label="Select Delivery Method"
          :options="['Option 1', 'Option 2', 'Option 3']"
          :selected="deliverylist"
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
