<script setup lang="ts">
import ContentCard from '@/components/contentcard/ContentCard.vue';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '@/components/ui/table';
import EmptyComponent from '@/components/EmptyComponent.vue';

const props = defineProps<{
  peoList: string[];
  editing: boolean;
}>();

defineEmits(['update:editing']);
</script>

<template>
  <ContentCard editable :editing="editing" @update:editing="$emit('update:editing', $event)">
    <template #title>
      Programme Education Outcomes (PEOs)
    </template>
    <template #body>
      <EmptyComponent v-if="peoList.length === 0">
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
              <TableHead class="text-center">#</TableHead>
              <TableHead class="">Descriptor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="(peo, peoIndex) in peoList" :key="peoIndex">
              <TableCell class="text-center w-0">{{ `PEO${peoIndex + 1}` }}</TableCell>
              <TableCell class="">{{ peo }}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </template>
    </template>
  </ContentCard>
</template>
