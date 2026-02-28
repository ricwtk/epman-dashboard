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
import BadgeList from '@/components/BadgeList.vue';
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
      Program Outcomes (POs) Mapping Recommendations
    </template>
    <template #body>
      <EmptyComponent v-if="poList.length === 0">
        <template #title>
          No Programme Outcomes
        </template>
        <template #description>
          Define programme outcomes to display mapping recommendations
        </template>
      </EmptyComponent>
      <Table v-else>
        <TableHeader>
          <TableRow>
            <TableHead class="text-center" rowspan="2">PO</TableHead>
            <TableHead class="text-center" rowspan="2">PEO</TableHead>
            <TableHead class="w-0 bg-border"></TableHead>
            <TableHead class="text-center" colspan="3">Exam Based</TableHead>
            <TableHead class="w-0 bg-border"></TableHead>
            <TableHead class="text-center" colspan="3">Project Based</TableHead>
          </TableRow>
          <TableRow>
            <TableHead class="w-0 bg-border"></TableHead>
            <TableHead class="text-center">WK</TableHead>
            <TableHead class="text-center">WP</TableHead>
            <TableHead class="text-center">EA</TableHead>
            <TableHead class="w-0 bg-border"></TableHead>
            <TableHead class="text-center">WK</TableHead>
            <TableHead class="text-center">WP</TableHead>
            <TableHead class="text-center">EA</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="(po, poIndex) in poList" :key="poIndex">
            <TableCell class="text-center">{{ `PO${poIndex + 1}` }}</TableCell>
            <TableCell class="text-center">
              <BadgeList :items="[`PEO${po.mapping.peo}`]" />
            </TableCell>
            <TableCell class="w-4 bg-border"></TableCell>
            <TableCell class="text-center">
              <BadgeList :items="po.mapping.examBased.wk.map((wk) => `WK${wk}`)" />
            </TableCell>
            <TableCell class="text-center">
              <BadgeList :items="po.mapping.examBased.wp.map((wp) => `WP${wp}`)" />
            </TableCell>
            <TableCell class="text-center">
              <BadgeList :items="po.mapping.examBased.ea.map((ea) => `EA${ea}`)" />
            </TableCell>
            <TableCell class="w-4 bg-border"></TableCell>
            <TableCell class="text-center">
              <BadgeList :items="po.mapping.projectBased.wk.map((wk) => `WK${wk}`)" />
            </TableCell>
            <TableCell class="text-center">
              <BadgeList :items="po.mapping.projectBased.wp.map((wp) => `WP${wp}`)" />
            </TableCell>
            <TableCell class="text-center">
              <BadgeList :items="po.mapping.projectBased.ea.map((ea) => `EA${ea}`)" />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </template>
  </ContentCard>
</template>
