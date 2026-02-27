<script setup lang="ts">
import { ref, computed } from 'vue'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import VerticalText from '@/components/VerticalText.vue'
import { ChevronUpIcon, ChevronDownIcon, MinusIcon, PlusIcon } from 'lucide-vue-next'
import EmptyComponent from '@/components/EmptyComponent.vue';

import { BLOOM_TAXONOMY, PO_ATTRIBUTES } from '@/constants'

import { getEditingCourseAndStore } from '@/composables/course'
const { course, editingCourseStore } = getEditingCourseAndStore()

const selectedBloomTaxonomy = computed(() => {
  return course.value.cos.map((co) => `${co.bloomtax[0].toUpperCase()}${co.bloomtax[1]}`)
})

const updateBloomTaxonomy = (coIndex: number, newBloomTaxonomy: string) => {
  const co = course.value.cos[coIndex]
  if (co) {
    let newBloomTaxonomyArray = newBloomTaxonomy.toLowerCase().split('')
    co.bloomtax = [String(newBloomTaxonomyArray[0]), Number(newBloomTaxonomyArray[1])]
    editingCourseStore.updateCourse(course.value)
  }
}

const handleMappingChange = (coIndex: number, type: 'po' | 'wk' | 'wp' | 'ea', mappingIndex: number, checked: boolean) => {
  const co = course.value.cos[coIndex]
  if (co) {
    if (type === 'po') {
      if (checked) {
        co.pos.push(mappingIndex + 1)
      } else {
        co.pos = co.pos.filter((pos) => pos !== mappingIndex + 1)
      }
    } else if (type === 'wk') {
      if (checked) {
        co.wks.push(mappingIndex + 1)
      } else {
        co.wks = co.wks.filter((wk) => wk !== mappingIndex + 1)
      }
    } else if (type === 'wp') {
      if (checked) {
        co.wps.push(mappingIndex + 1)
      } else {
        co.wps = co.wps.filter((wp) => wp !== mappingIndex + 1)
      }
    } else if (type === 'ea') {
      if (checked) {
        co.eas.push(mappingIndex + 1)
      } else {
        co.eas = co.eas.filter((ea) => ea !== mappingIndex + 1)
      }
    }
    editingCourseStore.updateCourse(course.value)
  }
}

const wkOptions = [
  "Natural and Social Sciences",
  "Mathematics and Computer Science",
  "Engineering Fundamentals",
  "Engineering Specialist Knowledge",
  "Engineering Design and Operations",
  "Engineering Practice",
  "Engineers in Society",
  "Research Skills",
  "Professional and Ethical Responsibility"
]

const wpOptions = [
  "Depth of Knowledge Required",
  "Range of Conflicting Requirements",
  "Depth of Analysis Required",
  "Familiarity of Issues",
  "Extent of Applicable Codes",
  "Extent of Stakeholder Involvement and Conflicting Requirements",
  "Interdependence"
]

const eaOptions = [
  "Range of Resources",
  "Level of Interactions",
  "Innovation",
  "Consequences to Society and the Environment",
  "Familiarity"
]

const emptyComponent = computed<{
  show: boolean, title: string, description: string
}>(() => {
  if (!course.value.cos) return {
    show: true,
    title: 'Course object not ready',
    description: 'Wait for the course object to be ready'
  }
  else if (course.value.cos.length === 0) {
    return {
      show: true,
      title: 'No Course Outcomes',
      description: 'Define course outcomes to display mapping matrices'
    }
  }
  else if (Object.keys(editingCourseStore.courseUsage.programmes).length === 0) {
    return {
      show: true,
      title: 'Course not assigned to any programme',
      description: 'Add course to the structure of a programme to display mapping matrices'
    }
  }
  else if (!editingCourseStore.selectedProgramme.value) {
    return {
      show: true,
      title: 'No Programme Selected',
      description: 'Select a programme to display mapping matrices'
    }
  }
  else if (editingCourseStore.selectedProgramme.value && !editingCourseStore.selectedSchool.value) {
    return {
      show: true,
      title: 'Programme not assigned to any school',
      description: `Course is assigned to ${editingCourseStore.selectedProgramme.value.name} but ${editingCourseStore.selectedProgramme.value.name} is not assigned to any school. Add the programme to a school to display mapping matrices`
    }
  }
  else {
    return {
      show: false,
      title: '',
      description: ''
    }
  }
})
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="font-semibold">CO Definition</div>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead class="w-0"></TableHead>
          <TableHead class="w-0">#</TableHead>
          <TableHead class="">Description</TableHead>
          <TableHead class="w-0 text-center">Bloom Taxonomy</TableHead>
          <TableHead class="w-0 text-center">SDG</TableHead>
          <TableHead class="w-0"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="(co, coIndex) in course.cos" :key="coIndex">
          <TableCell class="w-14 text-center">
            <Button variant="destructive" @click="editingCourseStore.removeCo(coIndex)"><MinusIcon /></Button>
          </TableCell>
          <TableCell class="">{{ coIndex + 1 }}</TableCell>
          <TableCell class="">
            <Textarea :id="'desc' + coIndex" v-model="co.description" />
          </TableCell>
          <TableCell class="w-0">
            <Select :modelValue="selectedBloomTaxonomy[coIndex]" @update:modelValue="(value) => updateBloomTaxonomy(coIndex, String(value))">
              <SelectTrigger class="w-40">
                <SelectValue placeholder="Select"/>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup v-for="(domain, index) in BLOOM_TAXONOMY" :key="index">
                  <SelectLabel>{{ domain.domain }}</SelectLabel>
                  <SelectItem v-for="(level, levelIndex) in domain.levels" :key="levelIndex" :value="`${domain.domain[0]!.toUpperCase()}${levelIndex+1}`">
                    {{ `${domain.domain[0]!.toUpperCase()}${levelIndex+1} ${level}` }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </TableCell>
          <TableCell class="w-0 text-center">
            <Checkbox v-model="co.sdg" :id="`co${coIndex + 1}sdg`"/>
          </TableCell>
          <TableCell class="w-14 text-center">
            <div class="flex flex-col gap-1">
              <Button
                variant="secondary"
                :disabled="coIndex === 0"
                @click="editingCourseStore.moveCoUp(coIndex)"
              ><ChevronUpIcon /></Button>
              <Button
                variant="secondary"
                :disabled="coIndex === course.cos.length - 1"
                @click="editingCourseStore.moveCoDown(coIndex)"
              ><ChevronDownIcon /></Button>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <Button variant="default" @click="editingCourseStore.addCo"><PlusIcon /></Button>

    <EmptyComponent v-if="emptyComponent.show">
      <template #title>
        {{emptyComponent.title}}
      </template>
      <template #description>
        {{emptyComponent.description}}
      </template>
    </EmptyComponent>

    <template v-else>
      <div class="font-semibold">CO to Programme Outcome (PO) Mapping</div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead class="align-bottom text-center w-0">CO</TableHead>
            <TableHead class="align-bottom text-center"
              v-for="(po, poIndex) in PO_ATTRIBUTES"
              :key="poIndex"
            >
              <VerticalText :label="`PO${poIndex + 1}`" :content="po" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="(co, coIndex) in course.cos" :key="coIndex" class="text-center">
            <TableCell class="w-0">CO{{ coIndex + 1 }}</TableCell>
            <TableCell v-for="(po, poIndex) in PO_ATTRIBUTES" :key="poIndex">
              <Checkbox
                :modelValue="co.pos.includes(poIndex + 1)"
                :id="`co${coIndex + 1}po${poIndex + 1}`"
                @update:modelValue="(checked) => handleMappingChange(coIndex, 'po', poIndex, Boolean(checked))"
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <div class="font-semibold">CO to Knowledge Profile (WK) Mapping</div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead class="align-bottom text-center w-0">CO</TableHead>
            <TableHead class="align-bottom text-center w-0">PO</TableHead>
            <TableHead class="align-bottom text-center"
              v-for="(wk, wkIndex) in wkOptions"
              :key="wkIndex"
            >
              <VerticalText :label="`WK${wkIndex + 1}`" :content="wk" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="(co, coIndex) in course.cos" :key="coIndex" class="text-center">
            <TableCell class="w-0">CO{{ coIndex + 1 }}</TableCell>
            <TableCell class="w-0">{{ co.pos.map(pos => `PO${pos}`).join(', ') }}</TableCell>
            <TableCell v-for="(wk, wkIndex) in wkOptions" :key="wkIndex">
              <Checkbox
                :modelValue="co.wks.includes(wkIndex + 1)"
                :id="`co${coIndex + 1}wk${wkIndex + 1}`"
                @update:modelValue="(checked) => handleMappingChange(coIndex, 'wk', wkIndex, Boolean(checked))"
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <div class="font-semibold">CO to Complex Engineering Problem (WP) Mapping</div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead class="align-bottom text-center w-0">CO</TableHead>
            <TableHead class="align-bottom text-center w-0">PO</TableHead>
            <TableHead class="align-bottom text-center"
              v-for="(wp, wpIndex) in wpOptions"
              :key="wpIndex"
            >
              <VerticalText :label="`WP${wpIndex + 1}`" :content="wp" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="(co, coIndex) in course.cos" :key="coIndex" class="text-center">
            <TableCell class="w-0">CO{{ coIndex + 1 }}</TableCell>
            <TableCell class="w-0">{{ co.pos.map(pos => `PO${pos}`).join(', ') }}</TableCell>
            <TableCell v-for="(wp, wpIndex) in wpOptions" :key="wpIndex">
              <Checkbox
              :modelValue="co.wps.includes(wpIndex + 1)"
              :id="`co${coIndex + 1}wp${wpIndex + 1}`"
              @update:modelValue="(checked) => handleMappingChange(coIndex, 'wp', wpIndex, Boolean(checked))"
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <div class="font-semibold">CO to Complex Engineering Activities (EA) Mapping</div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead class="align-bottom text-center w-0">CO</TableHead>
            <TableHead class="align-bottom text-center w-0">PO</TableHead>
            <TableHead class="align-bottom text-center"
              v-for="(ea, eaIndex) in eaOptions"
              :key="eaIndex"
            >
              <VerticalText :label="`EA${eaIndex + 1}`" :content="ea" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="(co, coIndex) in course.cos" :key="coIndex" class="text-center">
            <TableCell class="w-0">CO{{ coIndex + 1 }}</TableCell>
            <TableCell class="w-0">{{ co.pos.map(pos => `PO${pos}`).join(', ') }}</TableCell>
            <TableCell v-for="(ea, eaIndex) in eaOptions" :key="eaIndex">
              <Checkbox
              :modelValue="co.eas.includes(eaIndex + 1)"
              :id="`co${coIndex + 1}ea${eaIndex + 1}`"
              @update:modelValue="(checked) => handleMappingChange(coIndex, 'ea', eaIndex, Boolean(checked))"
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </template>

    <!-- <div
      v-for="(co, coIndex) in colist"
      :key="coIndex"
      class="flex flex-col gap-3"
    >
      <div class="flex flex-col gap-1 grow">
        <Label :for="'desc' + coIndex">{{ `CO${coIndex + 1}` }}</Label>
        <Textarea :id="'desc' + coIndex" :value="co.description" />
      </div>

      <div class="flex flex-row gap-3 items-center">
        <Checkbox :default-value="false" :id="`sdg${coIndex}`"/>
        <Label :for="`sdg${coIndex}`">SDG</Label>
      </div>

      <div class="flex flex-wrap gap-3">
        <div class="flex flex-col gap-1 flex-1 shrink-0 min-w-75">
          <Label :for="`po${coIndex}`">PO</Label>
          <MultiSelect
            :input-id="`po${coIndex}`"
            label="Select PO"
            :options="[1,2,3,4,5,6,7,8,9].map((x) => `PO${x}`)"
            :selected="co.pos.map((x) => `PO${x}`)"
            emptymessage="No POs"
          />
        </div>
        <div class="flex flex-col gap-1 flex-1 shrink-0 min-w-75">
          <Label :for="`wa${coIndex}`">WA</Label>
          <MultiSelect
            :input-id="`wa${coIndex}`"
            label="Select WA"
            :options="[1,2,3,4,5,6,7,8,9].map((x) => `WA${x}`)"
            :selected="co.was.map((x) => `WA${x}`)"
            emptymessage="No WAs"
          />
        </div>
        <div class="flex flex-col gap-1 flex-1 shrink-0 min-w-75">
          <Label :for="`wk${coIndex}`">WK</Label>
          <MultiSelect
            :input-id="`wk${coIndex}`"
            label="Select WK"
            :options="[1,2,3,4,5,6,7,8,9].map((x) => `WK${x}`)"
            :selected="co.wks.map((x) => `WK${x}`)"
            emptymessage="No WKs"
          />
        </div>
        <div class="flex flex-col gap-1 flex-1 shrink-0 min-w-75">
          <Label :for="`ea${coIndex}`">EA</Label>
          <MultiSelect
            :input-id="`ea${coIndex}`"
            label="Select EA"
            :options="[1,2,3,4,5,6,7,8,9].map((x) => `EA${x}`)"
            :selected="co.eas.map((x) => `EA${x}`)"
            emptymessage="No EAs"
          />
        </div>
      </div>

      <div class="flex flex-wrap gap-1">
        <Button variant="outline" :disabled="coIndex === 0"><ChevronUpIcon /></Button>
        <Button variant="outline" :disabled="coIndex === colist.length - 1"><ChevronDownIcon /></Button>
        <div class="grow"></div>
        <Button variant="destructive"><MinusIcon /></Button>
      </div>


      <Separator class="my-5" v-if="coIndex < colist.length - 1"/>
    </div>

    <Button variant="default"><PlusIcon /></Button> -->
  </div>
</template>
