<script setup lang="ts">
import { computed } from 'vue';
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
import Component from './update/Component.vue'
import { RotateCcwIcon } from 'lucide-vue-next';

const props = defineProps({
  isOpen: Boolean,
});

const emit = defineEmits(['update:isOpen']);

const toggleDialog = () => {
  emit('update:isOpen', !props.isOpen);
};

import { getEditingSchoolAndStore } from "@/composables/school";
const { editingSchoolStore } = getEditingSchoolAndStore();
const diff = computed(() => editingSchoolStore.checkDiff([]))
const resetSchool = () => { editingSchoolStore.resetSchool(); }
</script>

<template>
<Dialog :open="isOpen" @update:open="toggleDialog">
  <DialogContent class="overflow-clip">
    <DialogHeader>
      <DialogTitle>School Details Update</DialogTitle>
      <DialogDescription>Update school level details</DialogDescription>
    </DialogHeader>
    <Tabs default-value="summary" class="overflow-hidden" v-model="editingSchoolStore.selectedTab">
      <div class="flex flex-row overflow-hidden justify-between">
        <div class="overflow-auto">
          <TabsList>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="wk">WK</TabsTrigger>
            <TabsTrigger value="wp">WP</TabsTrigger>
            <TabsTrigger value="ea">EA</TabsTrigger>
          </TabsList>
        </div>
        <div>
          <Button v-if="diff"
            variant="ghost"
            class="reset-button"
            @click="resetSchool"
          >
            <RotateCcwIcon />
          </Button>
        </div>
      </div>
      <div class="overflow-auto h-[calc(100vh-300px)]">
        <TabsContent value="summary" class="w-full">
           <Summary />
        </TabsContent>
        <TabsContent value="wk">
          <Component
            title="Washington Accord Knowledge & Attribute Profile (WK)"
            shortlabel="WK"
            component="wks" />
        </TabsContent>
        <TabsContent value="wp">
          <Component
            title="Washington Accord Problem Identification & Solving (WP)"
            shortlabel="WP"
            component="wps" />
        </TabsContent>
        <TabsContent value="ea">
          <Component
            title="Complex Engineering Activities (EA)"
            shortlabel="EA"
            component="eas" />
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
