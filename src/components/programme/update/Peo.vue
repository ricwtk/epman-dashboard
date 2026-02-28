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
import EmptyComponent from '@/components/EmptyComponent.vue';

const { programme, editingProgrammeStore } = getEditingProgrammeAndStore();
const overallDiff = computed(() => {
  return editingProgrammeStore.checkDiff(["peoList"]);
});
const diffs = computed(() => {
  return programme.value.peoList.map((_: any, index: number) =>
    editingProgrammeStore.checkDiff(["peoList", String(index)])
  );
});
const resetDiff = () => {
  editingProgrammeStore.resetDiff(["peoList"]);
};

const addItem = () => {
  programme.value.peoList.push("");
}

const removeItem = (index: number) => {
  programme.value.peoList.splice(index, 1);
}

const resetItem = (index: number) => {
  editingProgrammeStore.resetDiff(["peoList", String(index)]);
}
</script>

<template>
  <!-- <div class="flex flex-col gap-4"> -->
    <div class="font-semibold flex flex-row items-center gap-1">
      Programme Education Outcomes Definition
      <ResetButton :disabled="!overallDiff" @reset="resetDiff" />
    </div>

    <EmptyComponent v-if="programme.peoList.length == 0">
      <template #title>
        No programme education outcomes available
      </template>
      <template #description>
        <Button variant="default" @click="addItem"><PlusIcon /> Click to add a programme education outcome</Button>
      </template>
    </EmptyComponent>

    <Table v-else>
      <TableHeader>
        <TableRow>
          <TableHead class="w-0 text-center"></TableHead>
          <TableHead class="w-0 text-center">#</TableHead>
          <TableHead>Descriptor</TableHead>
          <TableHead class="w-0"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow
          v-for="(item, index) in programme.peoList"
          :key="index"
          :class="diffs[index] ? 'bg-amber-100 hover:bg-amber-200' : ''"
        >
          <TableCell>
            <Button variant="destructive" @click="removeItem(Number(index))">
              <MinusIcon />
            </Button>
          </TableCell>
          <TableCell class="text-center">{{ `PEO${Number(index) + 1}` }}</TableCell>
          <TableCell>
            <Textarea v-model="programme.peoList[index]"></Textarea>
          </TableCell>
          <TableCell>
            <ResetButton :disabled="!diffs[index]" @reset="resetItem(index)" />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell colspan="4">
            <Button variant="default" class="w-full text-xs" size="sm" @click="addItem">
              <PlusIcon />
              Add PEO
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  <!-- </div> -->
</template>
