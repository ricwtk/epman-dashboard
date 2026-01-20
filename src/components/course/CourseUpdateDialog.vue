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
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Course Details Update</DialogTitle>
      <DialogDescription>Update course details</DialogDescription>
    </DialogHeader>
    <Tabs default-value="summary" class="items-center">
      <TabsList>
        <TabsTrigger value="summary">Summary</TabsTrigger>
        <TabsTrigger value="outcomes">Outcomes</TabsTrigger>
        <TabsTrigger value="assessments">Assessments</TabsTrigger>
        <TabsTrigger value="teachingplan">Teaching Plan</TabsTrigger>
        <TabsTrigger value="references">References</TabsTrigger>
      </TabsList>
      <TabsContent value="summary">Summary</TabsContent>
      <TabsContent value="outcomes">Outcomes</TabsContent>
      <TabsContent value="assessments">Assessments</TabsContent>
      <TabsContent value="teachingplan">Teaching Plan</TabsContent>
      <TabsContent value="references">References</TabsContent>
    </Tabs>
  </DialogContent>
</Dialog>
</template>
