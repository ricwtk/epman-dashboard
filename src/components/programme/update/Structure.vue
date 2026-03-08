<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import ResetButton from '@/components/ResetButton.vue'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import StructureGrid from "@/components/programme/StructureGrid.vue"
import CreateLabelPopover from '@/components/CreateLabelPopover.vue';
import { ButtonGroup } from '@/components/ui/button-group';
import { formatRevision } from '@/utils/common';
import { createNewStructure } from '@/utils/structureHelpers';
import { Button } from '@/components/ui/button';
import { type ProgrammeStructure } from '@/types/programme';

import { dataService } from '@/services/dataService';
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();

import { useStructureListStore } from '@/stores/structurelist';
const structureListStore = useStructureListStore();
const labels = computed(() => Object.keys(structureListStore.labelToInfoMap))

import { getEditingProgrammeAndStore } from '@/composables/programme';
const { programme, editingProgrammeStore } = getEditingProgrammeAndStore();
// const { structure, editingStructureStore } = getEditingStructureAndStore();

import { useStructureStore } from '@/stores/structure';
const structureStore = useStructureStore();

const {
  selectedStructureLabel,
  selectedRevision,
  revisions
} = storeToRefs(structureStore);

const diffs = computed(() => {
  return structureStore.checkDiff()
})
// const diffContent = computed(() => editingStructureStore.getDiff())
const resetDiff = () => structureStore.resetDiff()

const addNewStructure = async (newLabel: string) => {
  const newStructureParameters = {
    programme: programme.value.code,
    label: newLabel,
    revision: formatRevision(),
    committed: {
      on: new Date(),
      by: authStore.user?.email || 'unknown'
    }
  }
  const newStructure = createNewStructure(newStructureParameters);
  saveStructure(newStructure)
  structureStore.copyStructureFrom(newStructure)
};

const saveRevision = async () => {
  structureStore.save()
  saveStructure(structureStore.draft)
}

const saveStructure = async (struc: ProgrammeStructure) => {
  structureListStore.saveStructure(struc);
  await dataService.saveStructure(struc);
}

const deleteRevision = async () => {
  // const idToDelete = structure.value.id
  // await dataService.deleteItem("structures", idToDelete)
  structureStore.deleteRevision()
  if (structureStore.revisions.length == 0) {
    structureListStore.deleteStructure(structureStore.draft)
  }
};

</script>

<template>
  <div class="flex flex-col gap-1">
    <div class="flex flex-row justify-start gap-2">
      <ButtonGroup>
        <Select v-model="selectedStructureLabel">
          <SelectTrigger>
            <SelectValue placeholder="Select a structure" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem v-for="label in labels" :value="label">{{ label }}</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <CreateLabelPopover :currentList="labels" @create="addNewStructure">
          <template #title>New Structure</template>
          <template #description>Create new structure</template>
        </CreateLabelPopover>
      </ButtonGroup>
    </div>
    <template v-if="selectedStructureLabel">
      <div class="font-semibold flex flex-row items-center gap-1 h-9">
        Structure label: {{ selectedStructureLabel }}
        <ResetButton :disabled="!diffs" @reset="resetDiff" />
      </div>

      <StructureGrid v-model:semesters="structureStore.draft.semesters"
        v-model:semesterOrder="structureStore.draft.semesterOrder"
        :editable="true"
      >
        <template #header>
          <div class="flex flex-col gap-1">
            <Label for="label">Label</Label>
            <Input id="label" placeholder="Label for Programme Structure" v-model="structureStore.draft.label" disabled/>
          </div>
          <div class="flex flex-col gap-1 grow">
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
          <Button variant="destructive" @click="deleteRevision">Delete revision</Button>
          <Button variant="default" @click="saveRevision">Save structure</Button>
        </template>
      </StructureGrid>

    </template>
  </div>
</template>
