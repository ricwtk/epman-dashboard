<script setup lang='ts'>
import { ref, computed } from 'vue'
import { Table, TableBody, TableRow, TableCell } from '@/components/ui/table';
import ContentCard from '@/components/contentcard/ContentCard.vue';
import EmptyComponent from '@/components/EmptyComponent.vue';
import LoadingComponent from '@/components/LoadingComponent.vue';
import { Button } from '@/components/ui/button';
import { PlusIcon, XIcon, ChevronUpIcon, ChevronDownIcon } from 'lucide-vue-next';
import ListItemMenu from '@/components/ListItemMenu.vue';
import { InputGroup, InputGroupAddon, InputGroupTextarea } from '@/components/ui/input-group';
import ResetButton from '@/components/ResetButton.vue';

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
const references = computed(() =>
  course.value.references[props.referenceLabel]
);

const getMenuItems = (referenceIndex: number) => {
  return [{
    label: 'Remove',
    icon: XIcon,
    callback: () => { courseStore.deleteReference(props.referenceLabel, referenceIndex) },
  }, {
    label: 'Move Up',
    icon: ChevronUpIcon,
    disabled: referenceIndex == 0,
    callback: () => { courseStore.moveReferenceUp(props.referenceLabel, referenceIndex) },
  }, {
    label: 'Move Down',
    icon: ChevronDownIcon,
    disabled: referenceIndex == course.value.references[props.referenceLabel].length - 1,
    callback: () => { courseStore.moveReferenceDown(props.referenceLabel, referenceIndex) },
  }];
};
</script>

<template>
  <ContentCard editable :editing="editing" @update:editing="setEditing" @save="saveCourse">
    <template #title>
      <div class="flex flex-row items-center gap-2">
        <div>{{ props.title }}</div>
        <ResetButton
          :show="editing && courseStore.checkDiff(['references', props.referenceLabel])"
          @reset="courseStore.resetDiff(['references', props.referenceLabel])"
        />
      </div>
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
          <TableRow v-for="(reference, refIndex) in references" :key="refIndex">
            <TableCell v-if="editing" class="w-0">
              <ListItemMenu
                :menu-items="getMenuItems(refIndex)"
              />
            </TableCell>
            <TableCell>
              <InputGroup v-if="editing">
                <InputGroupTextarea v-model="references[refIndex]" />
                <InputGroupAddon align="block-end">
                  <div class="w-full flex justify-end">
                    <ResetButton
                      :show="courseStore.checkDiff(['references', props.referenceLabel, String(refIndex)])"
                      @reset="courseStore.resetDiff(['references', props.referenceLabel, String(refIndex)])"
                    />
                  </div>
                </InputGroupAddon>
              </InputGroup>
              <span v-else>{{ reference }}</span>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Button v-if="editing"
        @click="courseStore.addReference(props.referenceLabel, '')"
        variant="secondary"
        class="w-full"
      ><PlusIcon /></Button>
    </template>
  </ContentCard>
</template>
