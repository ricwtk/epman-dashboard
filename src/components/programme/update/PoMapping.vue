<script setup lang="ts">
import { getEditingProgrammeAndStore } from '@/composables/programme';

defineProps<{
  title: string,
  component: string
}>();

const { programme, editingProgrammeStore } = getEditingProgrammeAndStore();
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="font-bold">{{ title }}</div>

    <div class="font-semibold">PO to WK Mapping</div>

    <Table>
      <TableHeader>
        <TableRow>
          <TableHead class="align-bottom text-center w-0">CO</TableHead>
          <!-- <TableHead class="align-bottom text-center"
            v-for="(po, poIndex) in poOptions"
            :key="poIndex"
          > -->
            <!-- <VerticalText :label="`PO${poIndex + 1}`" :content="po" /> -->
          <!-- </TableHead> -->
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="(po, poIndex) in programme.poList" :key="poIndex" class="text-center">
          <TableCell class="w-0">PO{{ poIndex + 1 }}</TableCell>
          <!-- <TableCell v-for="(po, poIndex) in poOptions" :key="poIndex"> -->
            <!-- <Checkbox :default-value="false" :id="`co${coIndex + 1}po${poIndex + 1}`"/> -->
          <!-- </TableCell> -->
        </TableRow>
      </TableBody>
    </Table>

  </div>
</template>
