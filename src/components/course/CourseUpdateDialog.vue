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
import Outcomes from './update/Outcomes.vue'
import Assessments from './update/Assessments.vue'
import TeachingPlan from './update/TeachingPlan.vue'
import References from './update/References.vue'
import ResetButton from '@/components/ResetButton.vue'

const props = defineProps({
  isOpen: Boolean,
});

const emit = defineEmits(['update:isOpen']);

const toggleDialog = () => {
  emit('update:isOpen', !props.isOpen);
};

import { getEditingCourseAndStore } from "@/composables/course";
const { editingCourseStore } = getEditingCourseAndStore();
const diff = computed(() => editingCourseStore.checkDiff([]))
const resetCourse = () => { editingCourseStore.resetCourse(); }
const saveCourse = () => { editingCourseStore.saveCourse(); }
</script>

<template>
<Dialog :open="isOpen" @update:open="toggleDialog">
  <DialogContent class="overflow-clip">
    <DialogHeader>
      <DialogTitle>Course Details Update</DialogTitle>
      <DialogDescription>Update course details</DialogDescription>
    </DialogHeader>
    <Tabs default-value="summary" class="overflow-hidden" v-model="editingCourseStore.selectedTab">
      <div class="flex flex-row overflow-hidden justify-between">
        <div class="overflow-auto">
          <TabsList>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="outcomes">Outcomes</TabsTrigger>
            <TabsTrigger value="assessments">Assessments</TabsTrigger>
            <TabsTrigger value="teachingplan">Teaching Plan</TabsTrigger>
            <TabsTrigger value="references">References</TabsTrigger>
          </TabsList>
        </div>
        <div>
          <ResetButton v-if="diff" @click="resetCourse" />
        </div>
      </div>
      <div class="overflow-auto h-[calc(100vh-300px)]">
        <TabsContent value="summary" class="w-full">
          <Summary />
        </TabsContent>
        <TabsContent value="outcomes">
          <Outcomes />
        </TabsContent>
        <TabsContent value="assessments">
          <Assessments />
        </TabsContent>
        <TabsContent value="teachingplan">
          <TeachingPlan />
        </TabsContent>
        <TabsContent value="references">
          <References />
        </TabsContent>
      </div>
    </Tabs>
    <div class="justify-end flex flex-row grow gap-1">
      <!-- <Button variant="destructive">Commit</Button> -->
      <div class="grow"></div>
      <Button variant="default" @click="saveCourse">Save</Button>
      <Button variant="ghost" @click="toggleDialog">Cancel</Button>
    </div>
  </DialogContent>
</Dialog>
</template>
