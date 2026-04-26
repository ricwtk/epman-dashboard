<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import ContentCard from '@/components/contentcard/ContentCard.vue';
import LoadingComponent from '@/components/LoadingComponent.vue';
import EmptyComponent from '@/components/EmptyComponent.vue';
import ProgrammeMappingControls from '@/components/programme/ProgrammeMappingControls.vue';
import { Button } from '@/components/ui/button';
import { CheckIcon, ArrowUpDownIcon, Columns3Icon } from 'lucide-vue-next';

import { useProgrammeStore } from '@/stores/programme';
const programmeStore = useProgrammeStore();

import { useStructureStore } from '@/stores/structure';
const structureStore = useStructureStore();

const showBody = computed(() => structureStore.courseMappings.length > 0)
const visibleColumns = ref<{ [key: string]: boolean }>({
  po: true,
  wk: true,
  wp: true,
  ea: true,
  sdg: true,
})
const sorting = ref({
  column: 'semester',
  direction: 'asc',
})

const sortedMappings = computed(() => {
  return structureStore.courseMappings.toSorted((a, b) => {
    if (sorting.value.column === 'semester') {
      return sorting.value.direction === 'asc' ? a.semester - b.semester : b.semester - a.semester
    } else if (sorting.value.column === 'code') {
      return sorting.value.direction === 'asc' ? a.code.localeCompare(b.code) : b.code.localeCompare(a.code)
    } else if (sorting.value.column === 'name') {
      return sorting.value.direction === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    }
    return 0
  })
})
</script>

<template>
  <ContentCard :editable="false">
    <template #title>
      <Button @click="structureStore.getMappings" variant="secondary">Load Mappings</Button>
    </template>
    <template #actions v-if="showBody">
      <ProgrammeMappingControls v-model:visibleColumns="visibleColumns" v-model:sorting="sorting" />
    </template>
    <template #body v-if="showBody">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead class="w-0 text-center px-3">Semester</TableHead>
            <TableHead class="w-0 text-center px-3">Code</TableHead>
            <TableHead class="w-0 px-3">Name</TableHead>
            <template v-if="visibleColumns.po">
              <TableHead class="w-0.5 bg-accent"></TableHead>
              <TableHead v-for="(po, poIndex) in programmeStore.saved.poList" :key="poIndex">PO{{ poIndex+1 }}</TableHead>
            </template>
            <template v-if="visibleColumns.wk && programmeStore.school?.components?.wks">
              <TableHead class="w-0.5 bg-accent"></TableHead>
              <TableHead v-for="(wk, wkIndex) in programmeStore.school?.components?.wks" :key="wkIndex" class="text-center">WK{{ (wkIndex as number)+1 }}</TableHead>
            </template>
            <template v-if="visibleColumns.wp && programmeStore.school?.components?.wps">
              <TableHead class="w-0.5 bg-accent"></TableHead>
              <TableHead v-for="(wp, wpIndex) in programmeStore.school?.components?.wps" :key="wpIndex" class="text-center">WP{{ (wpIndex as number)+1 }}</TableHead>
            </template>
            <template v-if="visibleColumns.ea && programmeStore.school?.components?.eas">
              <TableHead class="w-0.5 bg-accent"></TableHead>
              <TableHead v-for="(ea, eaIndex) in programmeStore.school?.components?.eas" :key="eaIndex" class="text-center">EA{{ (eaIndex as number)+1 }}</TableHead>
            </template>
            <template v-if="visibleColumns.sdg">
              <TableHead class="w-0.5 bg-accent"></TableHead>
              <TableHead class="text-center">SDG</TableHead>
            </template>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-for="(mapping, index) in sortedMappings" :key="index">
            <TableRow>
              <TableCell class="w-0 text-center px-3">{{ mapping.semester }}</TableCell>
              <TableCell class="w-0 text-center px-3">{{ mapping.code }}</TableCell>
              <TableCell class="w-0 px-3">{{ mapping.name }}</TableCell>
              <template v-if="visibleColumns.po">
                <TableCell class="w-0.5 bg-accent"></TableCell>
                <TableCell v-for="(po, poIndex) in programmeStore.saved.poList" :key="poIndex" class="text-center"><CheckIcon class="inline-block" v-if="mapping.pos.includes(poIndex + 1)" /></TableCell>
              </template>
              <template v-if="visibleColumns.wk && programmeStore.school?.components?.wks">
                <TableCell class="w-0.5 bg-accent"></TableCell>
                <TableCell v-for="(wk, wkIndex) in programmeStore.school?.components?.wks" :key="wkIndex" class="text-center"><CheckIcon class="inline-block" v-if="mapping.wks.includes((wkIndex as number)+1)" /></TableCell>
              </template>
              <template v-if="visibleColumns.wp && programmeStore.school?.components?.wps">
                <TableCell class="w-0.5 bg-accent"></TableCell>
                <TableCell v-for="(wp, wpIndex) in programmeStore.school?.components?.wps" :key="wpIndex" class="text-center"><CheckIcon class="inline-block" v-if="mapping.wps.includes((wpIndex as number)+1)" /></TableCell>
              </template>
              <template v-if="visibleColumns.ea && programmeStore.school?.components?.eas">
                <TableCell class="w-0.5 bg-accent"></TableCell>
                <TableCell v-for="(ea, eaIndex) in programmeStore.school?.components?.eas" :key="eaIndex" class="text-center"><CheckIcon class="inline-block" v-if="mapping.eas.includes((eaIndex as number)+1)" /></TableCell>
              </template>
              <template v-if="visibleColumns.sdg">
                <TableCell class="w-0.5 bg-accent"></TableCell>
                <TableCell class="text-center"><CheckIcon class="inline-block" v-if="mapping.sdg" /></TableCell>
              </template>
            </TableRow>
          </template>
        </TableBody>
      </Table>
    </template>
  </ContentCard>
</template>
