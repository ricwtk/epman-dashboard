<script setup lang="ts">
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
// import Assessments from './update/Assessments.vue'
// import TeachingPlan from './update/TeachingPlan.vue'
// import References from './update/References.vue'

const props = defineProps({
  isOpen: Boolean,
});

const emit = defineEmits(['update:isOpen']);

const toggleDialog = () => {
  emit('update:isOpen', !props.isOpen);
};
</script>

<template>
<Dialog :open="isOpen" @update:open="toggleDialog">
  <DialogContent class="overflow-clip">
    <DialogHeader>
      <DialogTitle>Course Details Update</DialogTitle>
      <DialogDescription>Update course details</DialogDescription>
    </DialogHeader>
    <Tabs default-value="summary" class="overflow-hidden">
      <div class="overflow-auto">
        <TabsList>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="outcomes">Outcomes</TabsTrigger>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
          <TabsTrigger value="teachingplan">Teaching Plan</TabsTrigger>
          <TabsTrigger value="references">References</TabsTrigger>
        </TabsList>
      </div>
      <div class="overflow-auto h-[calc(100vh-300px)]">
        <TabsContent value="summary" class="w-full">
          <Summary />
        </TabsContent>
        <TabsContent value="outcomes">
          <Outcomes />
        </TabsContent>
        <TabsContent value="assessments">Assessments</TabsContent>
        <TabsContent value="teachingplan">Teaching Plan</TabsContent>
        <TabsContent value="references">References</TabsContent>
      </div>
    </Tabs>
     <div class="justify-end flex flex-row grow gap-1">
      <Button variant="default">Save</Button>
      <Button variant="ghost">Cancel</Button>
    </div>
  </DialogContent>
</Dialog>
</template>
