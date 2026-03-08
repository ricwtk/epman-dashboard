<script setup lang="ts">
import type { AttrDesc } from '@/types/school';
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
  title: string,
  shortlabel?: string,
  items: AttrDesc[],
  editing: boolean,
}>();

defineEmits(['update:editing']);
</script>

<template>
  <ContentCard editable :editing="editing" @update:editing="$emit('update:editing', $event)">
    <template #title>
      {{ title }}
    </template>
    <template #body>
    <EmptyComponent v-if="items.length === 0">
      <template #title>
        No {{ title }}
      </template>
      <template #description>
        Add item to display
      </template>
    </EmptyComponent>
    <Table class="" v-else>
      <TableHeader>
        <TableRow>
          <TableHead class="text-center">#</TableHead>
          <TableHead class="">Attribute</TableHead>
          <TableHead class="">Descriptor</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="(item, index) in items" :key="index">
          <TableCell class="text-center w-0">{{ `${shortlabel}${index + 1}` }}</TableCell>
          <TableCell class="max-w-[] whitespace-normal wrap-break-word">{{ item.attribute }}</TableCell>
          <TableCell class="w-7/10">{{ item.descriptor }}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
    </template>
  </ContentCard>
</template>
