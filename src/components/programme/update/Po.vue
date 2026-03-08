<script setup lang="ts">
import { computed } from 'vue';
// import { getEditingProgrammeAndStore } from '@/composables/programme';

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PlusIcon, MinusIcon } from 'lucide-vue-next';
import ResetButton from '@/components/ResetButton.vue';
import VerticalText from '@/components/VerticalText.vue';
import { Checkbox } from '@/components/ui/checkbox';
import EmptyComponent from '@/components/EmptyComponent.vue';

import { createNewPo } from '@/utils/programmeHelpers';

// const { programme, editingProgrammeStore } = getEditingProgrammeAndStore();

import { useProgrammeStore } from '@/stores/programme';
const programmeStore = useProgrammeStore();

const overallDiff = computed(() => {
  return programmeStore.checkDiff(["poList"]);
});
const diffs = computed(() => {
  return programmeStore.draft.poList.map((_: any, index: number) =>
    programmeStore.checkDiff(["poList", String(index)])
  );
});
const resetDiff = () => {
  programmeStore.resetDiff(["poList"]);
};

const addItem = () => {
  programmeStore.draft.poList.push(createNewPo());
}

const removeItem = (index: number) => {
  programmeStore.draft.poList.splice(index, 1);
}

const resetItem = (index: number) => {
  programmeStore.resetDiff(["poList", String(index)]);
}

const togglePeo = (poIndex: number, peoIndex: number) => {
  if (programmeStore.draft.poList[poIndex]) {
    programmeStore.draft.poList[poIndex].mapping.peo = peoIndex + 1;
  }
}
</script>

<template>
  <div class="font-semibold flex flex-row items-center gap-1">
    Programme Outcomes Definition
    <ResetButton :disabled="!overallDiff" @reset="resetDiff" />
  </div>

  <EmptyComponent v-if="programmeStore.draft.poList.length == 0">
    <template #title>
      No programme outcomes available
    </template>
    <template #description>
      <Button variant="default" @click="addItem"><PlusIcon /> Click to add a programme outcome</Button>
    </template>
  </EmptyComponent>

  <Table v-else>
    <TableHeader>
      <TableRow>
        <TableHead class="w-0"></TableHead>
        <TableHead class="w-0 text-center align-bottom">#</TableHead>
        <TableHead class="align-bottom">Attribute</TableHead>
        <TableHead class="align-bottom">Descriptor</TableHead>
        <TableHead class="w-0 text-center" v-if="programmeStore.draft.peoList.length == 0">No PEO defined</TableHead>
        <TableHead class="w-0 text-center align-bottom" v-else
          v-for="(item, index) in programmeStore.draft.peoList"
          :key="index"
        >
          <VerticalText :label="`PEO${Number(index) + 1}`" :content="item"/>
        </TableHead>
        <TableHead class="w-0"></TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow
        v-for="(item, index) in programmeStore.draft.poList"
        :key="index"
        :class="diffs[index] ? 'bg-amber-100 hover:bg-amber-200' : ''"
      >
        <TableCell>
          <Button variant="destructive" @click="removeItem(Number(index))">
            <MinusIcon />
          </Button>
        </TableCell>
        <TableCell class="text-center">{{ `PO${Number(index) + 1}` }}</TableCell>
        <TableCell>
          <Input v-model="item.attribute"></Input>
        </TableCell>
        <TableCell>
          <Textarea v-model="item.descriptor"></Textarea>
        </TableCell>
        <TableCell class="w-0" v-if="programmeStore.draft.peoList.length == 0"></TableCell>
        <TableCell class="w-0 text-center align-middle" v-else
          v-for="(peo, peoIndex) in programmeStore.draft.peoList"
          :key="peoIndex"
        >
          <Checkbox
            :id="`po-${index}-peo-${peoIndex}`"
            :modelValue="item.mapping.peo == peoIndex + 1"
            @update:modelValue="togglePeo(index, peoIndex)"
          />
        </TableCell>
        <TableCell class="w-0">
          <ResetButton :disabled="!diffs[index]" @click="resetItem(index)" />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell :colspan="4 + (programmeStore.draft.peoList.length == 0 ? 1 : programmeStore.draft.peoList.length) + 1">
          <Button variant="default" class="w-full text-xs" size="sm" @click="addItem">
            <PlusIcon />
            Add PO
          </Button>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
