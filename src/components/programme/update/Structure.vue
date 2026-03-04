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

import { dataService } from '@/services/dataService';
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();

import { useStructureListStore } from '@/stores/structurelist';
const structureListStore = useStructureListStore();
const labels = computed(() => Object.keys(structureListStore.labelToInfoMap))

import { getEditingProgrammeAndStore, getEditingStructureAndStore } from '@/composables/programme';
const { programme, editingProgrammeStore } = getEditingProgrammeAndStore();
const { structure, editingStructureStore } = getEditingStructureAndStore();
const {
  selectedStructureLabel,
  structureRevisions,
  selectedRevision,
  revisions
} = storeToRefs(editingStructureStore);
onMounted(() => {
  editingStructureStore.programmeCode = programme.value.code;
})

const diffs = computed(() => {
  return editingStructureStore.checkDiff()
})
// const diffContent = computed(() => editingStructureStore.getDiff())
const resetDiff = () => editingStructureStore.resetDiff()

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
  try {
    await dataService.saveStructure(newStructure);
    structureListStore.saveStructure(newStructure);
    // editingStructureStore
  } catch (error) {
    console.error('Error saving structure:', error);
  }
};

const deleteRevision = async () => {
  // dataService
  // if (no more revisions) structureListStore.deleteStructure(structure.value);
  // editingStructureStore
  //
  // try {
  //   console.log(editingStructureStore.structure.id);
  //   const { updatedStructureLabel, updatedRevision } = await editingProgrammeStore.deleteStructure(editingStructureStore.structure);
  //   editingProgrammeStore.structureTrigger++
  //   if (updatedStructureLabel) {
  //     selectedStructureLabel.value = updatedStructureLabel;
  //     selectedRevision.value = updatedRevision;
  //   } else {
  //     selectedRevision.value = null;
  //     selectedStructureLabel.value = null;
  //   }
  // } catch (error) {
  //   console.error('Error deleting structure:', error);
  // }
};

const saveStructure = async () => {
  await editingStructureStore.saveStructure();
}

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

      <StructureGrid v-model="structure.structure" :editable="true">
        <template #header>
          <div class="flex flex-col gap-1">
            <Label for="label">Label</Label>
            <Input id="label" placeholder="Label for Programme Structure" v-model="structure.label" disabled/>
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
          <Button variant="default" @click="saveStructure">Save structure</Button>
        </template>
      </StructureGrid>

    </template>
  </div>
</template>
