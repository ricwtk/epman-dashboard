<script setup lang="ts">
import type { Po } from '@/types/programme';
import ContentCard from '@/components/contentcard/ContentCard.vue';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { InputGroup, InputGroupTextarea, InputGroupAddon } from '@/components/ui/input-group';
import EmptyComponent from '@/components/EmptyComponent.vue';
import LoadingComponent from '@/components/LoadingComponent.vue';
import ResetButton from '@/components/ResetButton.vue';
import ListItemMenu from '@/components/ListItemMenu.vue';
import { XIcon, ChevronUpIcon, ChevronDownIcon } from 'lucide-vue-next';

import { useProgrammeEditor } from '@/composables/useProgrammeEditor';
const { editing, programme, saveProgramme, setEditing, programmeStore } = useProgrammeEditor();

const getMenuItems = (poIndex: number) => {
  return [{
    label: 'Remove',
    icon: XIcon,
    callback: () => { programmeStore.removeFromList('poList', poIndex)},
  }, {
    label: 'Move Up',
    icon: ChevronUpIcon,
    disabled: poIndex == 0,
    callback: () => { programmeStore.moveUp('poList', poIndex)},
  }, {
    label: 'Move Down',
    icon: ChevronDownIcon,
    disabled: poIndex == programme.value.poList.length - 1,
    callback: () => { programmeStore.moveDown('poList', poIndex)},
  }];
};
// const props = defineProps<{
//   poList: Po[];
//   editing: boolean;
//   loading?: boolean;
// }>();

// defineEmits(['update:editing']);
</script>

<template>
  <!-- <ContentCard editable :editing="editing" @update:editing="$emit('update:editing', $event)"> -->
  <ContentCard editable :editing="editing" @update:editing="setEditing" @save="saveProgramme">
    <template #title>
      <div class="flex flex-row items-center gap-2">
        <div>Programme Outcomes (POs)</div>
        <ResetButton :show="!!programmeStore.draft.code && programmeStore.checkDiff(['poList'])" @reset="programmeStore.resetDiff(['poList'])" />
      </div>
    </template>
    <template #body>
      <LoadingComponent :show="programmeStore.loading" />
      <EmptyComponent v-if="programme.poList.length === 0 && !editing">
        <template #title>
          No Programme Outcomes
        </template>
        <template #description>
          Define programme outcomes to display mapping
        </template>
      </EmptyComponent>
      <template v-else>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead class="w-0" v-if="editing"></TableHead>
              <TableHead class="text-center">#</TableHead>
              <TableHead class="">Attribute</TableHead>
              <TableHead class="">Descriptor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="(po, poIndex) in programme.poList" :key="poIndex">
              <TableCell v-if="editing">
                <ListItemMenu :menu-items="getMenuItems(poIndex)"/>
              </TableCell>
              <TableCell class="text-center w-0">{{ `PO${poIndex + 1}` }}</TableCell>
              <TableCell class="">
                <InputGroup v-if="editing">
                  <InputGroupTextarea v-model="programme.poList[poIndex]!.attribute"/>
                  <InputGroupAddon align="block-end">
                    <div class="w-full flex justify-end">
                      <ResetButton
                        :show="programmeStore.checkDiff(['poList', String(poIndex), 'attribute'])"
                        @reset="programmeStore.resetDiff(['poList', String(poIndex), 'attribute'])"
                      />
                    </div>
                  </InputGroupAddon>
                </InputGroup>
                <span v-else>{{ po.attribute }}</span>
              </TableCell>
              <TableCell class="w-7/10">
                <InputGroup v-if="editing">
                  <InputGroupTextarea v-model="programme.poList[poIndex]!.descriptor"/>
                  <InputGroupAddon align="block-end">
                    <div class="w-full flex justify-end">
                      <ResetButton
                        :show="programmeStore.checkDiff(['poList', String(poIndex), 'descriptor'])"
                        @reset="programmeStore.resetDiff(['poList', String(poIndex), 'descriptor'])"
                      />
                    </div>
                  </InputGroupAddon>
                </InputGroup>
                <span v-else>{{ po.descriptor }}</span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Button v-if="editing" variant="secondary" class="w-full" @click="programmeStore.addPo()"><PlusIcon /></Button>
      </template>
    </template>
  </ContentCard>
</template>
