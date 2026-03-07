<script setup lang="ts">
import { computed } from 'vue';
import ContentCard from '@/components/contentcard/ContentCard.vue';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import EmptyComponent from '@/components/EmptyComponent.vue';
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
      <EmptyComponent v-if="labels.length === 0">
        <template #title>
          No Programme Structure
        </template>
        <template #description>
          Define at least one programme structure to view
        </template>
      </EmptyComponent>
      <StructureGrid v-else
        :editable="false"
        v-model:semesters="structure.semesters"
        v-model:semesterOrder="structure.semesterOrder"
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
      <EmptyComponent v-if="selectedStructureLabel == ''">
        <template #title>
          Select Programme Structure
        </template>
        <template #description>
          Select the label of a programme structure to view
        </template>
      </EmptyComponent>
      <EmptyComponent v-else-if="selectedRevision == ''">
        <template #title>
          Select Revision
        </template>
        <template #description>
          Select the revision of a programme structure to view
        </template>
      </EmptyComponent>
    </template>
  </ContentCard>
</template>
