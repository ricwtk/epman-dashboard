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
import { COURSE_TYPES } from '@/constants';
import { PenIcon } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';

const props = defineProps<{
  poList: Po[];
  editing: boolean;
  editable?: boolean;
}>();

defineEmits<{
  (e: 'update:editing', value: boolean): void;
  (e: 'editMapping', value: string): void
}>();
</script>

<template>
  <ContentCard :editable="false" :editing="editing" @update:editing="$emit('update:editing', $event)">
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
            <template v-for="courseType in COURSE_TYPES" :key="courseType.key">
              <TableHead class="w-0 bg-border"></TableHead>
              <TableHead class="text-center" colspan="3">
                {{ courseType.label }}
                <Button variant="ghost" size="sm" @click="$emit('editMapping', courseType.key)">
                  <PenIcon />
                </Button>
              </TableHead>
            </template>
          </TableRow>
          <TableRow>
            <template v-for="courseType in COURSE_TYPES" :key="courseType.key">
              <TableHead class="w-0 bg-border"></TableHead>
              <TableHead class="text-center">WK</TableHead>
              <TableHead class="text-center">WP</TableHead>
              <TableHead class="text-center">EA</TableHead>
            </template>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="(po, poIndex) in poList" :key="poIndex">
            <TableCell class="text-center">{{ `PO${poIndex + 1}` }}</TableCell>
            <TableCell class="text-center">
              <BadgeList :items="[`PEO${po.mapping.peo}`]" />
            </TableCell>
            <template v-for="courseType in COURSE_TYPES" :key="courseType.key">
              <TableCell class="w-4 bg-border"></TableCell>
              <TableCell class="text-center">
                <BadgeList :items="po.mapping[courseType.key].wk.map((wk) => `WK${wk}`)" />
              </TableCell>
              <TableCell class="text-center">
                <BadgeList :items="po.mapping[courseType.key].wp.map((wp) => `WP${wp}`)" />
              </TableCell>
              <TableCell class="text-center">
                <BadgeList :items="po.mapping[courseType.key].ea.map((ea) => `EA${ea}`)" />
              </TableCell>
            </template>
          </TableRow>
        </TableBody>
      </Table>
    </template>
  </ContentCard>
</template>
