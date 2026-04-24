<script setup lang="ts">
import ContentCard from '@/components/contentcard/ContentCard.vue';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell} from '@/components/ui/table';
import { InputGroup, InputGroupAddon, InputGroupTextarea } from '@/components/ui/input-group';
import EmptyComponent from '@/components/EmptyComponent.vue';
import LoadingComponent from '@/components/LoadingComponent.vue';
import ResetButton from '@/components/ResetButton.vue';
import ListItemMenu from '@/components/ListItemMenu.vue';
import { XIcon, ChevronUpIcon, ChevronDownIcon } from 'lucide-vue-next';

import { useProgrammeEditor } from '@/composables/useProgrammeEditor';
const { editing, programme, saveProgramme, setEditing, programmeStore } = useProgrammeEditor();

const getMenuItems = (peoIndex: number) => {
  return [{
    label: 'Remove',
    icon: XIcon,
    callback: () => { programmeStore.removeFromList('peoList', peoIndex)},
  }, {
    label: 'Move Up',
    icon: ChevronUpIcon,
    disabled: peoIndex == 0,
    callback: () => { programmeStore.moveUp('peoList', peoIndex)},
  }, {
    label: 'Move Down',
    icon: ChevronDownIcon,
    disabled: peoIndex == programme.value.peoList.length - 1,
    callback: () => { programmeStore.moveDown('peoList', peoIndex)},
  }];
};
// const props = defineProps<{
//   peoList: string[];
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
        <div>Programme Education Outcomes (PEOs)</div>
        <ResetButton :show="!!programmeStore.draft.code && programmeStore.checkDiff(['peoList'])" @reset="programmeStore.resetDiff(['peoList'])" />
      </div>
    </template>
    <template #body>
      <LoadingComponent :show="programmeStore.loading" />
      <EmptyComponent v-if="programme.peoList.length === 0 && !editing">
        <template #title>
          No Programme Education Outcomes
        </template>
        <template #description>
          Define programme education outcomes to display list
        </template>
      </EmptyComponent>
      <template v-else>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead class="w-0" v-if="editing"></TableHead>
              <TableHead class="text-center">#</TableHead>
              <TableHead class="">Descriptor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="(peo, peoIndex) in programme.peoList" :key="peoIndex">
              <TableCell v-if="editing">
                <ListItemMenu :menu-items="getMenuItems(peoIndex)"/>
              </TableCell>
              <TableCell class="text-center w-0">{{ `PEO${peoIndex + 1}` }}</TableCell>
              <TableCell class="">
                <InputGroup v-if="editing">
                  <InputGroupTextarea v-model="programme.peoList[peoIndex]"/>
                  <InputGroupAddon align="block-end">
                    <div class="w-full flex justify-end">
                      <ResetButton
                        :show="programmeStore.checkDiff(['peoList', String(peoIndex)])"
                        @reset="programmeStore.resetDiff(['peoList', String(peoIndex)])"
                      />
                    </div>
                  </InputGroupAddon>
                </InputGroup>
                <span v-else>
                  {{ peo }}
                </span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </template>
    </template>
  </ContentCard>
</template>
