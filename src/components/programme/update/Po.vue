<script setup lang="ts">
import { computed } from 'vue';
import { getEditingProgrammeAndStore } from '@/composables/programme';

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

const { programme, editingProgrammeStore } = getEditingProgrammeAndStore();
const overallDiff = computed(() => {
  return editingProgrammeStore.checkDiff(["poList"]);
});
const diffs = computed(() => {
  return programme.value.poList.map((_: any, index: number) =>
    editingProgrammeStore.checkDiff(["poList", String(index)])
  );
});
const resetDiff = () => {
  editingProgrammeStore.resetDiff(["poList"]);
};

const addItem = () => {
  programme.value.poList.push(createNewPo());
}

const removeItem = (index: number) => {
  programme.value.poList.splice(index, 1);
}

const resetItem = (index: number) => {
  editingProgrammeStore.resetDiff(["poList", String(index)]);
}

const togglePeo = (poIndex: number, peoIndex: number) => {
  if (programme.value.poList[poIndex]) {
    programme.value.poList[poIndex].mapping.peo = peoIndex + 1;
  }
}
</script>

<template>
  <div class="font-semibold flex flex-row items-center gap-1">
    Programme Outcomes Definition
    <ResetButton :disabled="!overallDiff" @reset="resetDiff" />
  </div>

  <EmptyComponent v-if="programme.poList.length == 0">
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
        <TableHead class="w-0 text-center" v-if="programme.peoList.length == 0">No PEO defined</TableHead>
        <TableHead class="w-0 text-center align-bottom" v-else
          v-for="(item, index) in programme.peoList"
          :key="index"
        >
          <VerticalText :label="`PEO${Number(index) + 1}`" :content="item.slice(0,10)+(item.length > 10 ? '...' : '')"/>
        </TableHead>
        <TableHead class="w-0"></TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow
        v-for="(item, index) in programme.poList"
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
        <TableCell class="w-0" v-if="programme.peoList.length == 0"></TableCell>
        <TableCell class="w-0 text-center align-middle" v-else
          v-for="(peo, peoIndex) in programme.peoList"
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
        <TableCell :colspan="4 + (programme.peoList.length == 0 ? 1 : programme.peoList.length)">
          <Button variant="default" class="w-full text-xs" size="sm" @click="addItem">
            <PlusIcon />
            Add PO
          </Button>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
