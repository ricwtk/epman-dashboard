<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import {
  createStructureInfo,
  getStructureByProgrammeAndLabel,
  getStructureLabelsByProgramme
} from '@/utils/structureHelpers';
import ContentCard from '@/components/contentcard/ContentCard.vue';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import StructureGrid from '@/components/programme/StructureGrid.vue';
import type { ProgrammeStructureInfo } from '@/types/programme';

defineEmits(['update:editing']);

const props = defineProps<{
  structureList: { [label: string]: ProgrammeStructureInfo };
  editing: boolean;
}>();

import { useViewingStructureStore } from '@/stores/viewingstructure';
import { storeToRefs } from 'pinia';
const viewingStructureStore = useViewingStructureStore();
const {
  structure,
  selectedStructureLabel,
  selectedRevision,
  revisions
} = storeToRefs(viewingStructureStore)

const labels = computed(() => Object.keys(props.structureList))
</script>

<template>
  <ContentCard editable :editing="editing" @update:editing="$emit('update:editing', $event)">
    <template #title>
      Programme Structure
    </template>
    <template #body>
      <StructureGrid
        :editable="false"
        v-model="structure.structure"
      >
        <template #header>
          <div class="flex flex-col gap-1 flex-1">
            <Label for="label">Label</Label>
            <Select id="label" v-model="selectedStructureLabel">
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Select a structure" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem v-for="label in labels" :value="label">{{ label }}</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div class="flex flex-col gap-1 flex-5">
            <Label for="revision">Revision</Label>
            <Select id="revision" v-model="selectedRevision">
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Select a revision" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem
                    v-for="srev in revisions"
                    :value="srev"
                  >{{ srev }}</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </template>
      </StructureGrid>

    </template>
  </ContentCard>
</template>
