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
import Summary from './update/Summary.vue'
import Po from './update/Po.vue'
import PoMapping from './update/PoMapping.vue'
import Structure from './update/Structure.vue'
import { RotateCcwIcon } from 'lucide-vue-next';

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
</script>

<template>
<Dialog :open="isOpen" @update:open="toggleDialog">
  <DialogContent class="overflow-clip">
    <DialogHeader>
      <DialogTitle>Programme Details Update</DialogTitle>
      <DialogDescription>Update programme details</DialogDescription>
    </DialogHeader>
    <Tabs default-value="summary" class="overflow-hidden">
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
          <Button v-if="diff"
            variant="ghost"
            class="reset-button"
            @click="resetProgramme"
          >
            <RotateCcwIcon />
          </Button>
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
      <Button variant="destructive">Commit</Button>
      <div class="grow"></div>
      <Button variant="default">Save draft</Button>
      <Button variant="ghost">Cancel</Button>
    </div>
  </DialogContent>
</Dialog>
</template>
