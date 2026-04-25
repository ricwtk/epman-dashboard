<script setup lang="ts">
import { computed } from 'vue';
import ContentCard from '@/components/contentcard/ContentCard.vue';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ButtonGroup } from '@/components/ui/button-group';
import { Button } from '@/components/ui/button';
import EmptyComponent from '@/components/EmptyComponent.vue';
import StructureGrid from '@/components/programme/StructureGrid.vue';
import LoadingComponent from '@/components/LoadingComponent.vue';
import CreateLabelPopover from '@/components/CreateLabelPopover.vue';
import PlainTooltip from '@/components/PlainTooltip.vue';

import { PlusIcon, MinusIcon, SaveIcon } from 'lucide-vue-next';

import { useProgrammeEditor } from '@/composables/useProgrammeEditor';
const { editing, programme, saveProgramme, setEditing, programmeStore } = useProgrammeEditor();

const setEditingWithStructure = (value: boolean) => {
  setEditing(value);
  if (structureStore.draft.label !== structureStore.saved.label) {
    structureStore.createDraft();
  }
}

const structure = computed({
  get: () => editing.value ? structureStore.draft : structureStore.saved,
  set: (value) => {
    if (editing.value) structureStore.draft = value;
    else structureStore.saved = value;
  },
})
// defineEmits(['update:editing']);

const props = defineProps<{
  editable?: boolean;
}>();

import { storeToRefs } from 'pinia';
import { useStructureStore } from '@/stores/structure';
const structureStore = useStructureStore();
const {
  selectedStructureLabel,
  selectedRevision,
  revisions
} = storeToRefs(structureStore)

import { useStructureListStore } from '@/stores/structurelist';
const structureListStore = useStructureListStore();
const labels = computed(() => Object.keys(structureListStore.labelToInfoMap))
</script>

<template>
  <!-- <ContentCard editable :editing="editing" @update:editing="$emit('update:editing', $event)"> -->
  <ContentCard editable :editing="editing" @update:editing="setEditingWithStructure" @save="saveProgramme">
    <template #title>
      Programme Structure
    </template>
    <template #body>
      <LoadingComponent :show="programmeStore.loading" />
      <EmptyComponent v-if="labels.length === 0">
        <template #title>
          No Programme Structure
        </template>
        <template #description>
          Define at least one programme structure to view
        </template>
        <template #content>
          <div class="flex gap-1">
            <CreateLabelPopover v-if="editable" :currentList="labels" @create="programmeStore.addNewStructure">
              <template #title>New Structure</template>
              <template #description>Create new structure</template>
               <template #trigger>
                <Button variant="outline">
                  <PlainTooltip content="Create new structure">
                    <PlusIcon /> Create new structure
                  </PlainTooltip>
                </Button>
              </template>
            </CreateLabelPopover>
          </div>
        </template>
      </EmptyComponent>
      <StructureGrid v-else
        :editable="editing"
        v-model:semesters="structure.semesters"
        v-model:semesterOrder="structure.semesterOrder"
      >
        <template #header>
          <div class="flex flex-col gap-1 flex-1">
            <Label for="label">Label</Label>
            <ButtonGroup class="w-full">
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
              <CreateLabelPopover v-if="editing" :currentList="labels" @create="programmeStore.addNewStructure">
                <template #title>New Structure</template>
                <template #description>Create new structure</template>
              </CreateLabelPopover>
            </ButtonGroup>
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
                <Button variant="default" @click="structureStore.save()"><SaveIcon /></Button>
              </PlainTooltip>
            </div>
          </div>
        </template>
      </StructureGrid>
      <EmptyComponent v-if="labels.length !== 0 && selectedStructureLabel == ''">
        <template #title>
          Select Programme Structure
        </template>
        <template #description>
          Select the label of a programme structure to view
        </template>
      </EmptyComponent>
      <EmptyComponent v-else-if="labels.length !== 0 && selectedRevision == ''">
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
