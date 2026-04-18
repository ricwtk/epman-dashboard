<script setup lang='ts'>
import { ref, computed } from 'vue'
import { Table, TableBody, TableRow, TableCell } from '@/components/ui/table';
import ContentCard from '@/components/contentcard/ContentCard.vue';
import EmptyComponent from '@/components/EmptyComponent.vue';
import LoadingComponent from '@/components/LoadingComponent.vue';
import { Button } from '@/components/ui/button';
import { PlusIcon, XIcon, ChevronUpIcon, ChevronDownIcon } from 'lucide-vue-next';
import ListItemMenu from '@/components/ListItemMenu.vue';
import { Textarea } from '@/components/ui/textarea';

import { useCourseStore } from '@/stores/course';
const courseStore = useCourseStore();
const saveCourse = () => { courseStore.save(); }

const editing = ref(false);

const course = computed({
  get: () => editing.value ? courseStore.draft : courseStore.saved,
  set: (value) => {
    if (editing.value)
      courseStore.draft = value;
    else
      courseStore.saved = value;
  },
})

const setEditing = (value: boolean) => {
  editing.value = value;
  if (courseStore.draft.code !== courseStore.saved.code) {
    courseStore.createDraft();
  }
};

const props = defineProps<{
  title: string;
  referenceLabel: 'main' | 'additional';
}>();
const references = computed(() => course.value.references.filter(reference => reference.label === props.referenceLabel));

const getMenuItems = (referenceIndex: number) => {
  return [{
    label: 'Remove',
    icon: XIcon,
    callback: () => { courseStore.deleteReference(referenceIndex) },
  }, {
    label: 'Move Up',
    icon: ChevronUpIcon,
    disabled: referenceIndex == 0,
    callback: () => { courseStore.moveReferenceUp(referenceIndex) },
  }, {
    label: 'Move Down',
    icon: ChevronDownIcon,
    disabled: referenceIndex == course.value.references.length - 1,
    callback: () => { courseStore.moveReferenceDown(referenceIndex) },
  }];
};
</script>

<template>
  <ContentCard editable :editing="editing" @update:editing="setEditing" @save="saveCourse">
    <template #title>
      {{ props.title }}
    </template>
    <template #body>
      <LoadingComponent :show="courseStore.loading" />
      <EmptyComponent v-if="references.length === 0 && !editing">
        <template #title>
          No {{ props.title }}
        </template>
        <template #description>
          Define references to display list
        </template>
      </EmptyComponent>
      <Table v-else>
        <TableBody>
          <TableRow v-for="(reference, referenceIndex) in references" :key="referenceIndex">
            <TableCell v-if="editing" class="w-0">
              <ListItemMenu
                :menu-items="getMenuItems(referenceIndex)"
              />
            </TableCell>
            <TableCell>
              <Textarea v-model="reference.description" v-if="editing"></Textarea>
              <span v-else>{{ reference.description }}</span>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Button v-if="editing"
        @click="courseStore.addReference({label: props.referenceLabel})"
        variant="secondary"
        class="w-full"
      ><PlusIcon /></Button>
    </template>
  </ContentCard>
</template>
