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
// import Summary from './update/Summary.vue'

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
      <DialogTitle>School Details Update</DialogTitle>
      <DialogDescription>Update school level details</DialogDescription>
    </DialogHeader>
    <Tabs default-value="summary" class="overflow-hidden">
      <div class="overflow-auto">
        <TabsList>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="wk">WK</TabsTrigger>
          <TabsTrigger value="wp">WP</TabsTrigger>
          <TabsTrigger value="ea">EA</TabsTrigger>
        </TabsList>
      </div>
      <div class="overflow-auto h-[calc(100vh-300px)]">
        <TabsContent value="summary" class="w-full">
          <!-- <Summary /> -->
        </TabsContent>
        <TabsContent value="wk">
          <!-- <Outcomes /> -->
        </TabsContent>
        <TabsContent value="wp">
          <!-- <Assessments /> -->
        </TabsContent>
        <TabsContent value="ea">
          <!-- <TeachingPlan /> -->
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
