<script setup lang="ts">
import { computed } from 'vue';
import ContentCard from '@/components/contentcard/ContentCard.vue';
import LoadingComponent from '@/components/LoadingComponent.vue';
import EmptyComponent from '@/components/EmptyComponent.vue';

import { useProgrammeEditor } from '@/composables/useProgrammeEditor';
const { programme, programmeStore } = useProgrammeEditor();

import { useStructureStore } from '@/stores/structure';
const structureStore = useStructureStore();

import { useStructureListStore } from '@/stores/structurelist';
const structureListStore = useStructureListStore();
const labels = computed(() => Object.keys(structureListStore.labelToInfoMap))
</script>

<template>
  <ContentCard :editable="false">
    <template #title>
      Mappings
    </template>
    <template #body>
      <LoadingComponent :show="programmeStore.loading" />
      <EmptyComponent v-if="labels.length === 0">
        <template #title>No Programme Structure</template>
        <template #description>Define at least one programme structure to view</template>
      </EmptyComponent>
      <div v-else>
        <div class="flex flex-col gap-1 flex-1">
          <Label for="label">Label</Label>
          <Select id="label" v-model="structureStore.selectedStructureLabel">
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
          <div class="flex gap-1">
            <ButtonGroup class="w-full">
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
              <PlainTooltip v-if="editing" content="Delete revision">
                <Button variant="destructive" @click="structureStore.deleteRevision()"><MinusIcon /></Button>
              </PlainTooltip>
            </ButtonGroup>
            <PlainTooltip v-if="editing" content="Save structure">
              <Button variant="default" @click="structureStore.save()" :disabled="structureStore.loading || !structureStore.checkDiff()"><SaveIcon /></Button>
            </PlainTooltip>
            <PlainTooltip v-if="editing" content="Reset">
              <Button variant="secondary" @click="structureStore.resetDiff()" :disabled="structureStore.loading || !structureStore.checkDiff()"><RotateCcwIcon /></Button>
            </PlainTooltip>
          </div>
        </div>
      </div>
    </template>
  </ContentCard>
</template>
