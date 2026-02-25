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
import { PlusIcon, MinusIcon, RotateCcwIcon } from 'lucide-vue-next';
import ResetButton from '@/components/ResetButton.vue';

const { programme, editingProgrammeStore } = getEditingProgrammeAndStore();
const overallDiff = computed(() => {
  return editingProgrammeStore.checkDiff(["peoList"]);
});
const diffs = computed(() => {
  return programme.value.poList.map((_: any, index: number) =>
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
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="font-semibold flex flex-row items-center gap-1">
      Programme Education Outcomes Definition
      <ResetButton v-if="overallDiff" @reset="resetDiff" />
    </div>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead class="w-0 text-center"></TableHead>
          <TableHead class="w-0 text-center">#</TableHead>
          <TableHead>Descriptor</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow
          v-for="(item, index) in programme.peoList"
          :key="index"
          :class="diffs[index] ? 'bg-yellow-100' : ''"
        >
          <TableCell>
            <Button variant="destructive" @click="removeItem(Number(index))">
              <MinusIcon />
            </Button>
          </TableCell>
          <TableCell class="text-center">{{ `PEO${Number(index) + 1}` }}</TableCell>
          <TableCell>
            <Input v-model="programme.peoList[index]"></Input>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell colspan="4">
            <Button variant="default" class="w-full" @click="addItem">
              <PlusIcon />
              Add PEO
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
