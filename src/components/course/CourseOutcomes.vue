<script setup lang="ts">
import { type Co } from '@/lib/course';
import ContentCard from '@/components/contentcard/ContentCard.vue';
import BadgeList from '@/components/BadgeList.vue';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '@/components/ui/table';
import { CheckIcon, MinusIcon } from "lucide-vue-next";

defineProps<{
  cos: Co[] | [];
}>();
</script>

<template>
  <ContentCard editable>
    <template #title>
      Course Outcomes
    </template>
    <template #body="{ editing }">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead class="font-bold cell-center">#</TableHead>
            <TableHead class="font-bold">CO</TableHead>
            <TableHead class="font-bold cell-center">PO</TableHead>
            <TableHead class="font-bold cell-center">WA</TableHead>
            <TableHead class="font-bold cell-center">WK</TableHead>
            <TableHead class="font-bold cell-center">WP</TableHead>
            <TableHead class="font-bold cell-center">EA</TableHead>
            <TableHead class="font-bold cell-center">SDG</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="(co, index) in cos" :key="index">
            <TableCell class="cell-center">{{ index + 1 }}</TableCell>
            <TableCell>{{ co.description }}</TableCell>
            <TableCell class="cell-center">
              <BadgeList :items="co.pos.map((po) => 'PO'+po)" />
            </TableCell>
            <TableCell class="cell-center">
              <BadgeList :items="co.was.map((wa) => 'WA'+wa)" />
            </TableCell>
            <TableCell class="cell-center">
              <BadgeList :items="co.wks.map((wk) => 'WK'+wk)" />
            </TableCell>
            <TableCell class="cell-center">
              <BadgeList :items="co.wps.map((wp) => 'WP'+wp)" />
            </TableCell>
            <TableCell class="cell-center">
              <BadgeList :items="co.eas.map((ea) => 'EA'+ea)" />
            </TableCell>
            <TableCell class="cell-center">
              <CheckIcon :size="16" v-if="co.sdg" />
              <MinusIcon :size="16" v-else />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </template>
  </ContentCard>
</template>

<style scoped>
@reference '@/assets/base.css';

.cell-center {
  text-align: center;
}
</style>
