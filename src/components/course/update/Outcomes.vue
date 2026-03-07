<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'

import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import VerticalText from '@/components/VerticalText.vue'
import { ChevronUpIcon, ChevronDownIcon, MinusIcon, PlusIcon } from 'lucide-vue-next'
import ResetButton from '@/components/ResetButton.vue'
import EmptyComponent from '@/components/EmptyComponent.vue';
import { Field } from '@/components/ui/field'
import { Label } from '@/components/ui/label'
import BadgeList from '@/components/BadgeList.vue'

import { BLOOM_TAXONOMY } from '@/constants'

import { useCourseStore } from '@/stores/course'
const courseStore = useCourseStore()
const {
  draft,
  notAssignedToProgramme,
  programmeNotSelected,
  programmeNotAssigned
} = storeToRefs(courseStore)

// import { getEditingCourseAndStore } from '@/composables/course'
// const { course, editingCourseStore } = getEditingCourseAndStore()

const selectedBloomTaxonomy = computed(() => {
  return draft.value.cos.map((co) => `${co.bloomtax[0].toUpperCase()}${co.bloomtax[1]}`)
})

const updateBloomTaxonomy = (coIndex: number, newBloomTaxonomy: string) => {
  const co = draft.value.cos[coIndex]
  if (co) {
    let newBloomTaxonomyArray = newBloomTaxonomy.toLowerCase().split('')
    co.bloomtax = [String(newBloomTaxonomyArray[0]), Number(newBloomTaxonomyArray[1])]
  }
}

const addCo = () => courseStore.addCo();

const handleMappingChange = (coIndex: number, type: 'po' | 'wk' | 'wp' | 'ea', mappingIndex: number, checked: boolean) => {
  const co = draft.value.cos[coIndex]
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
  }
}

const poOptions = computed(() => {
  if (courseStore.selectedProgramme) {
    return courseStore.selectedProgramme.poList
  }
  return []
})

const wkOptions = computed(() => {
  if (courseStore.selectedSchool) {
    return courseStore.selectedSchool.components?.wks
  }
  return []
})

const wpOptions = computed(() => {
  if (courseStore.selectedSchool) {
    return courseStore.selectedSchool.components?.wps
  }
  return []
})

const eaOptions = computed(() => {
  if (courseStore.selectedSchool) {
    return courseStore.selectedSchool.components?.eas
  }
  return []
})

const emptyComponent = computed<{
  show: boolean, title: string, description: string
}>(() => {
  if (!draft.value.cos) return {
    show: true,
    title: 'Course object not ready',
    description: 'Wait for the course object to be ready'
  }
  else if (draft.value.cos.length === 0) {
    return {
      show: true,
      title: 'No Course Outcomes',
      description: 'Define course outcomes to display mapping matrices'
    }
  }
  else if (notAssignedToProgramme.value) {
    return {
      show: true,
      title: 'Course not assigned to any programme',
      description: 'Add course to the structure of a programme to display mapping matrices'
    }
  }
  else if (programmeNotSelected.value) {
    return {
      show: true,
      title: 'No Programme Selected',
      description: 'Select a programme to display mapping matrices'
    }
  }
  else if (programmeNotAssigned.value) {
    return {
      show: true,
      title: 'Programme not assigned to any school',
      description: `Course is assigned to ${courseStore.selectedProgramme?.name} but ${courseStore.selectedProgramme?.name} is not assigned to any school. Add the programme to a school to display mapping matrices`
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

function resetDiff() {}

import { RECOMMENDATION_CLASS } from '@/constants'
function getRecommendationClass(coIndex: number, type: 'wk' | 'wp' | 'ea', mappingIndex: number): string {
  if (courseStore.recommendedMappingForCo[coIndex]?.[type]?.has(mappingIndex + 1)) {
    return RECOMMENDATION_CLASS
  }
  return ''
}
</script>

<template>
  <div class="font-semibold flex flex-row items-center gap-1 h-9">
    CO Definition
    <ResetButton :disabled="true" @reset="resetDiff()" />
  </div>

  <EmptyComponent v-if="draft.cos.length == 0">
    <template #title>
      No course outcomes available
    </template>
    <template #description>
      <Button variant="default" @click="addCo"><PlusIcon /> Click to add a course outcome</Button>
    </template>
  </EmptyComponent>

  <template v-else>
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
        <TableRow v-for="(co, coIndex) in draft.cos" :key="coIndex">
          <TableCell class="w-14 text-center">
            <Button variant="destructive" @click="courseStore.removeCo(coIndex)"><MinusIcon /></Button>
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
                @click="courseStore.moveCoUp(coIndex)"
              ><ChevronUpIcon /></Button>
              <Button
                variant="secondary"
                :disabled="coIndex === draft.cos.length - 1"
                @click="courseStore.moveCoDown(coIndex)"
              ><ChevronDownIcon /></Button>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <Button variant="default" class="w-full text-xs" size="sm" @click="addCo"><PlusIcon />Add Course Outcome</Button>

    <Field orientation="horizontal" class="my-2">
      <Label>Programme</Label>
      <Select :modelValue="courseStore.selectedProgrammeCode" @update:modelValue="(value) => courseStore.selectedProgrammeCode = String(value)">
        <SelectTrigger class="grow">
          <SelectValue placeholder="Select"/>
        </SelectTrigger>
        <SelectContent>
          <template v-for="(progKey, index) in Object.keys(courseStore.programmes)" :key="index">
            <SelectItem :value="progKey">{{ courseStore.programmes[progKey]?.name }}</SelectItem>
          </template>
        </SelectContent>
      </Select>
    </Field>

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
              v-for="(po, poIndex) in poOptions"
              :key="poIndex"
              :title="po.descriptor"
            >
              <VerticalText :label="`PO${poIndex + 1}`" :content="po.attribute" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="(co, coIndex) in draft.cos" :key="coIndex" class="text-center">
            <TableCell class="w-0">CO{{ coIndex + 1 }}</TableCell>
            <TableCell v-for="(po, poIndex) in poOptions" :key="poIndex">
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
              :title="wk.descriptor"
            >
              <VerticalText :label="`WK${Number(wkIndex) + 1}`" :content="wk.attribute" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="(co, coIndex) in draft.cos" :key="coIndex" class="text-center">
            <TableCell class="w-0">CO{{ coIndex + 1 }}</TableCell>
            <TableCell class="w-0">
              <BadgeList :items="co.pos.map(pos => `PO${pos}`)" />
            </TableCell>
            <TableCell v-for="(wk, wkIndex) in wkOptions" :key="wkIndex"
              :class="getRecommendationClass(coIndex, 'wk', Number(wkIndex))"
            >
              <Checkbox
                :modelValue="co.wks.includes(Number(wkIndex) + 1)"
                :id="`co${coIndex + 1}wk${Number(wkIndex) + 1}`"
                @update:modelValue="(checked) => handleMappingChange(coIndex, 'wk', Number(wkIndex), Boolean(checked))"
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
              :title="wp.descriptor"
            >
              <VerticalText :label="`WP${Number(wpIndex) + 1}`" :content="wp.attribute" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="(co, coIndex) in draft.cos" :key="coIndex" class="text-center">
            <TableCell class="w-0">CO{{ coIndex + 1 }}</TableCell>
            <TableCell class="w-0">
              <BadgeList :items="co.pos.map(pos => `PO${pos}`)" />
            </TableCell>
            <TableCell v-for="(wp, wpIndex) in wpOptions" :key="wpIndex"
              :class="getRecommendationClass(coIndex, 'wp', Number(wpIndex))"
            >
              <Checkbox
              :modelValue="co.wps.includes(Number(wpIndex) + 1)"
              :id="`co${coIndex + 1}wp${Number(wpIndex) + 1}`"
              @update:modelValue="(checked) => handleMappingChange(coIndex, 'wp', Number(wpIndex), Boolean(checked))"
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
              :title="ea.descriptor"
            >
              <VerticalText :label="`EA${Number(eaIndex) + 1}`" :content="ea.attribute" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="(co, coIndex) in draft.cos" :key="coIndex" class="text-center">
            <TableCell class="w-0">CO{{ coIndex + 1 }}</TableCell>
            <TableCell class="w-0">
              <BadgeList :items="co.pos.map(pos => `PO${pos}`)" />
            </TableCell>
            <TableCell v-for="(ea, eaIndex) in eaOptions" :key="eaIndex"
              :class="getRecommendationClass(coIndex, 'ea', Number(eaIndex))"
            >
              <Checkbox
              :modelValue="co.eas.includes(Number(eaIndex) + 1)"
              :id="`co${coIndex + 1}ea${Number(eaIndex) + 1}`"
              @update:modelValue="(checked) => handleMappingChange(coIndex, 'ea', Number(eaIndex), Boolean(checked))"
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </template>
  </template>
</template>
