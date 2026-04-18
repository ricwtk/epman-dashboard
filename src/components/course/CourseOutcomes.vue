<script setup lang="ts">
import { ref, computed } from 'vue';
import { type Co } from '@/types/course';
import ContentCard from '@/components/contentcard/ContentCard.vue';
import BadgeList from '@/components/BadgeList.vue';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { CheckIcon, MinusIcon, CircleChevronDownIcon, PlusIcon, XIcon, ChevronUpIcon, ChevronDownIcon } from "lucide-vue-next";
import EmptyComponent from '@/components/EmptyComponent.vue';
import LoadingComponent from '@/components/LoadingComponent.vue';
import MappingSelectionMenu from '@/components/course/MappingSelectionMenu.vue';
import BloomtaxSelection from '@/components/course/BloomtaxSelection.vue';
import ListItemMenu from '@/components/ListItemMenu.vue';

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

const selectBtLevel = (co: Co, domain: string, level: number) => {
  co.bloomtax[0] = domain.slice(0,1).toUpperCase();
  co.bloomtax[1] = level;
};

const getMenuItems = (coIndex: number) => {
  return [{
    label: 'Remove',
    icon: XIcon,
    callback: () => { courseStore.removeCo(coIndex)},
  }, {
    label: 'Move Up',
    icon: ChevronUpIcon,
    disabled: coIndex == 0,
    callback: () => { courseStore.moveCoUp(coIndex)},
  }, {
    label: 'Move Down',
    icon: ChevronDownIcon,
    disabled: coIndex == course.value.cos.length - 1,
    callback: () => { courseStore.moveCoDown(coIndex)},
  }];
};

// defineProps<{
//   cos: Co[] | [];
//   editing: boolean;
//   loading?: boolean;
// }>();

// defineEmits(['update:editing']);
</script>

<template>
  <!-- <ContentCard editable :editing="editing" @update:editing="$emit('update:editing', $event)"> -->
  <ContentCard editable :editing="editing" @update:editing="setEditing" @save="saveCourse">
    <template #title>
      Course Outcomes
    </template>
    <template #body>
      <LoadingComponent :show="courseStore.loading" />
      <EmptyComponent v-if="course.cos.length === 0">
        <template #title>
          No Course Outcomes
        </template>
        <template #description>
          Define course outcomes to display mapping
        </template>
      </EmptyComponent>
      <Table v-else>
        <TableHeader>
          <TableRow>
            <TableHead class="text-center w-0 px-10">#</TableHead>
            <TableHead class="">CO</TableHead>
            <TableHead class="text-center w-0 px-10">BT</TableHead>
            <TableHead class="text-center w-0 px-10">PO</TableHead>
            <TableHead class="text-center w-0 px-10">WK</TableHead>
            <TableHead class="text-center w-0 px-10">WP</TableHead>
            <TableHead class="text-center w-0 px-10">EA</TableHead>
            <TableHead class="text-center w-0 px-10">SDG</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="(co, index) in course.cos" :key="index">
            <TableCell class="text-center">
              <div class="flex justify-center items-center">
                <ListItemMenu :menu-items="getMenuItems(index)" v-if="editing"/>
                <span class="px-1">{{ index + 1 }}</span>
              </div>
            </TableCell>
            <TableCell>
              <Textarea v-model="co.description" v-if="editing" />
              <span v-else>
                {{ co.description }}
              </span>
            </TableCell>
            <TableCell class="text-center">
              <BloomtaxSelection
                :selected="`${co.bloomtax[0].toUpperCase()}${co.bloomtax[1]}`"
                :editing="editing"
                @select="(domain, level) => selectBtLevel(co, domain, level)"
              >
                <template #trigger>
                  <BadgeList
                    :editing="editing"
                    :items="[`${co.bloomtax[0].toUpperCase()}${co.bloomtax[1]}`]"
                  >
                    <template #editIcon>
                      <CircleChevronDownIcon :size="14" />
                    </template>
                  </BadgeList>
                </template>
              </BloomtaxSelection>
            </TableCell>
            <TableCell class="text-center">
              <template v-if="editing">
                <MappingSelectionMenu
                  class="mb-1 text-xs"
                  :items="courseStore.selectedProgramme?.poList.map((po, poIndex) => [`PO${poIndex + 1}`, po.attribute]) || []"
                  :selectedItems="co.pos"
                  @select="(itemIndex: number) => courseStore.toggleCoMapping(index, 'po', itemIndex + 1)"
                  label="PO"
                />
              </template>
              <BadgeList
                :items="co.pos.sort().map((po) => 'PO'+po)"
                :editing="editing"
                @remove="(item: string) => courseStore.removeCoMapping(index, 'po', Number(item.slice(2)))"
              />
            </TableCell>
            <TableCell class="text-center">
              <template v-if="editing">
                <MappingSelectionMenu
                  class="mb-1 text-xs"
                  :items="courseStore.WKLIST"
                  :selectedItems="co.wks"
                  @select="(itemIndex: number) => courseStore.toggleCoMapping(index, 'wk', itemIndex + 1)"
                  label="WK"
                />
              </template>
              <BadgeList
                :items="co.wks.sort().map((wk) => 'WK'+wk)"
                :editing="editing"
                @remove="(item: string) => courseStore.removeCoMapping(index, 'wk', Number(item.slice(2)))"
              />
            </TableCell>
            <TableCell class="text-center">
              <template v-if="editing">
                <MappingSelectionMenu
                  class="mb-1 text-xs"
                  :items="courseStore.WPLIST"
                  :selectedItems="co.wps"
                  @select="(itemIndex: number) => courseStore.toggleCoMapping(index, 'wp', itemIndex + 1)"
                  label="WP"
                />
              </template>
              <BadgeList
                :items="co.wps.sort().map((wp) => 'WP'+wp)"
                :editing="editing"
                @remove="(item: string) => courseStore.removeCoMapping(index, 'wp', Number(item.slice(2)))"
              />
            </TableCell>
            <TableCell class="text-center">
              <template v-if="editing">
                <MappingSelectionMenu
                  class="mb-1 text-xs"
                  :items="courseStore.EALIST"
                  :selectedItems="co.eas"
                  @select="(itemIndex: number) => courseStore.toggleCoMapping(index, 'ea', itemIndex + 1)"
                  label="EA"
                />
              </template>
              <BadgeList
                :items="co.eas.sort().map((ea) => 'EA'+ea)"
                :editing="editing"
                @remove="(item: string) => courseStore.removeCoMapping(index, 'ea', Number(item.slice(2)))"
              />
            </TableCell>
            <TableCell class="text-center">
              <Checkbox v-if="editing" v-model="co.sdg" />
              <template v-else>
                <CheckIcon class="inline-block" :size="16" v-if="co.sdg" />
                <MinusIcon class="inline-block" :size="16" v-else />
              </template>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Button v-if="editing" variant="secondary" class="w-full" @click="courseStore.addCo()"><PlusIcon /></Button>
    </template>
  </ContentCard>
</template>
