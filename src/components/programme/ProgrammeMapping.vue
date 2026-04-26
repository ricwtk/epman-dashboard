<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import ContentCard from '@/components/contentcard/ContentCard.vue';
import LoadingComponent from '@/components/LoadingComponent.vue';
import EmptyComponent from '@/components/EmptyComponent.vue';
import { Button } from '@/components/ui/button';
import { CheckIcon } from 'lucide-vue-next';

import { useProgrammeStore } from '@/stores/programme';
const programmeStore = useProgrammeStore();

onMounted(() => console.log(programmeStore.school))
import { useStructureStore } from '@/stores/structure';
const structureStore = useStructureStore();

const showBody = computed(() => structureStore.courseMappings.length > 0)
</script>

<template>
  <ContentCard :editable="false">
    <template #title>
      <Button @click="structureStore.getMappings" variant="secondary">Load Mappings</Button>
    </template>
    <template #body v-if="showBody">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead class="w-0 text-center px-3">Semester</TableHead>
            <TableHead class="w-0 text-center px-3">Code</TableHead>
            <TableHead class="w-0 px-3">Name</TableHead>
            <TableHead v-for="(po, poIndex) in programmeStore.saved.poList" :key="poIndex">PO{{ poIndex+1 }}</TableHead>
            <template v-if="programmeStore.school?.components?.wks">
              <TableHead v-for="(wk, wkIndex) in programmeStore.school?.components?.wks" :key="wkIndex">WK{{ (wkIndex as number)+1 }}</TableHead>
            </template>
            <template v-if="programmeStore.school?.components?.wps">
              <TableHead v-for="(wp, wpIndex) in programmeStore.school?.components?.wps" :key="wpIndex">WP{{ (wpIndex as number)+1 }}</TableHead>
            </template>
            <template v-if="programmeStore.school?.components?.eas">
              <TableHead v-for="(ea, eaIndex) in programmeStore.school?.components?.eas" :key="eaIndex">EA{{ (eaIndex as number)+1 }}</TableHead>
            </template>
            <TableHead>SDG</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-for="(mapping, index) in structureStore.courseMappings" :key="index">
            <TableRow>
              <TableCell colspan="7">{{ mapping }}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell class="w-0 text-center px-3">{{ mapping.semester }}</TableCell>
              <TableCell class="w-0 text-center px-3">{{ mapping.code }}</TableCell>
              <TableCell class="w-0 px-3">{{ mapping.name }}</TableCell>
              <TableCell v-for="(po, poIndex) in programmeStore.saved.poList" :key="poIndex"><CheckIcon v-if="mapping.pos.includes(poIndex + 1)" /></TableCell>
              <TableCell v-if="programmeStore.school?.components?.wks" v-for="(wk, wkIndex) in programmeStore.school?.components?.wks" :key="wkIndex"><CheckIcon v-if="mapping.wks.includes((wkIndex as number)+1)" /></TableCell>
              <TableCell v-if="programmeStore.school?.components?.wps" v-for="(wp, wpIndex) in programmeStore.school?.components?.wps" :key="wpIndex"><CheckIcon v-if="mapping.wps.includes((wpIndex as number)+1)" /></TableCell>
              <TableCell v-if="programmeStore.school?.components?.eas" v-for="(ea, eaIndex) in programmeStore.school?.components?.eas" :key="eaIndex"><CheckIcon v-if="mapping.eas.includes((eaIndex as number)+1)" /></TableCell>
              <TableCell><CheckIcon v-if="mapping.sdg" /></TableCell>
            </TableRow>
          </template>
        </TableBody>
      </Table>
    </template>
  </ContentCard>
</template>
