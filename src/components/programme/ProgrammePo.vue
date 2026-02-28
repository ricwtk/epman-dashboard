<script setup lang="ts">
import type { Po } from '@/types/programme';
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
  poList: Po[];
  editing: boolean;
}>();

defineEmits(['update:editing']);
</script>

<template>
  <ContentCard editable :editing="editing" @update:editing="$emit('update:editing', $event)">
    <template #title>
      Programme Outcomes (POs)
    </template>
    <template #body>
      <EmptyComponent v-if="poList.length === 0">
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
              <TableHead class="text-center">#</TableHead>
              <TableHead class="">Attribute</TableHead>
              <TableHead class="">Descriptor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="(po, poIndex) in poList" :key="poIndex">
              <TableCell class="text-center w-0">{{ `PO${poIndex + 1}` }}</TableCell>
              <TableCell class="">{{ po.attribute }}</TableCell>
              <TableCell class="w-7/10">{{ po.descriptor }}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </template>
    </template>
  </ContentCard>
</template>
