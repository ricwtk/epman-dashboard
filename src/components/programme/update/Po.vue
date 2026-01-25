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
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="font-medium flex flex-row items-center gap-1">
      Programme Outcomes
      <Button v-if="overallDiff"
        variant="ghost"
        class="reset-button"
        @click="resetDiff"
      >
        <RotateCcwIcon />
      </Button>
    </div>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead></TableHead>
          <TableHead class="w-0 text-center">#</TableHead>
          <TableHead>Attribute</TableHead>
          <TableHead>Descriptor</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow
          v-for="(item, index) in programme.poList"
          :key="index"
          :class="diffs[index] ? 'bg-yellow-100' : ''"
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
        </TableRow>
        <TableRow>
          <TableCell colspan="4">
            <Button variant="default" class="w-full" @click="addItem">
              <PlusIcon />
              Add PO
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
