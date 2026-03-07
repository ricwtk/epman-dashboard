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
import Peo from './update/Peo.vue'
import Po from './update/Po.vue'
import PoMapping from './update/PoMapping.vue'
import Structure from './update/Structure.vue'
import { COURSE_TYPES } from '@/constants';

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
            <TabsTrigger value="peo">PEO</TabsTrigger>
            <TabsTrigger value="po">PO</TabsTrigger>
            <template v-for="courseType in COURSE_TYPES" :key="courseType.key">
              <TabsTrigger :value="courseType.key">{{ courseType.label }}</TabsTrigger>
            </template>
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
        <TabsContent value="peo">
          <Peo />
        </TabsContent>
        <TabsContent value="po">
          <Po />
        </TabsContent>
        <template v-for="courseType in COURSE_TYPES" :key="courseType.key">
          <TabsContent :value="courseType.key">
            <PoMapping :title="`${courseType.label} Mapping`" :coursetype="courseType.key" />
          </TabsContent>
        </template>
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
