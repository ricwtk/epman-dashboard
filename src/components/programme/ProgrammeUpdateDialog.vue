<script setup lang="ts">
import { computed } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog'
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import ResetButton from '@/components/ResetButton.vue';
import Summary from './update/Summary.vue'
import Po from './update/Po.vue'
import PoMapping from './update/PoMapping.vue'
import Structure from './update/Structure.vue'

const props = defineProps({
  isOpen: Boolean,
});

const emit = defineEmits(['update:isOpen']);

const toggleDialog = () => {
  emit('update:isOpen', !props.isOpen);
};

import { getEditingProgrammeAndStore } from "@/composables/programme";
const { editingProgrammeStore } = getEditingProgrammeAndStore();
const diff = computed(() => editingProgrammeStore.checkDiff([]))
const resetProgramme = () => { editingProgrammeStore.resetProgramme(); }
const saveProgramme = () => { editingProgrammeStore.saveProgramme(); }
</script>

<template>
<Dialog :open="isOpen" @update:open="toggleDialog">
  <DialogContent class="overflow-clip">
    <DialogHeader>
      <DialogTitle>Programme Details Update</DialogTitle>
      <DialogDescription>Update programme details</DialogDescription>
    </DialogHeader>
    <Tabs default-value="summary" class="overflow-hidden" v-model="editingProgrammeStore.selectedTab">
      <div class="flex flex-row overflow-hidden justify-between">
        <div class="overflow-auto">
          <TabsList>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="po">PO</TabsTrigger>
            <TabsTrigger value="exambased">Exam Based</TabsTrigger>
            <TabsTrigger value="projectbased">Project Based</TabsTrigger>
            <TabsTrigger value="structure">Structure</TabsTrigger>
          </TabsList>
        </div>
        <div>
          <ResetButton v-if="diff" @reset="resetProgramme" />
        </div>
      </div>
      <div class="overflow-auto h-[calc(100vh-300px)]">
        <TabsContent value="summary" class="w-full">
           <Summary />
        </TabsContent>
        <TabsContent value="po">
          <Po />
        </TabsContent>
        <TabsContent value="exambased">
          <PoMapping title="Exam Based Mapping" coursetype="examBased" />
        </TabsContent>
        <TabsContent value="projectbased">
          <PoMapping title="Project Based Mapping" coursetype="projectBased" />
        </TabsContent>
        <TabsContent value="structure">
          <Structure />
        </TabsContent>
      </div>
    </Tabs>
    <div class="justify-end flex flex-row grow gap-1">
      <!-- <Button variant="destructive">Commit</Button> -->
      <div class="grow"></div>
      <Button variant="default" @click="saveProgramme">Save</Button>
      <Button variant="ghost" @click="toggleDialog">Cancel</Button>
    </div>
  </DialogContent>
</Dialog>
</template>
