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
            <TableHead class="font-bold text-center">#</TableHead>
            <TableHead class="font-bold">CO</TableHead>
            <TableHead class="font-bold text-center">PO</TableHead>
            <TableHead class="font-bold text-center">WA</TableHead>
            <TableHead class="font-bold text-center">WK</TableHead>
            <TableHead class="font-bold text-center">WP</TableHead>
            <TableHead class="font-bold text-center">EA</TableHead>
            <TableHead class="font-bold text-center">SDG</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="(co, index) in cos" :key="index">
            <TableCell class="text-center">{{ index + 1 }}</TableCell>
            <TableCell>{{ co.description }}</TableCell>
            <TableCell class="text-center">
              <BadgeList :items="co.pos.map((po) => 'PO'+po)" />
            </TableCell>
            <TableCell class="text-center">
              <BadgeList :items="co.was.map((wa) => 'WA'+wa)" />
            </TableCell>
            <TableCell class="text-center">
              <BadgeList :items="co.wks.map((wk) => 'WK'+wk)" />
            </TableCell>
            <TableCell class="text-center">
              <BadgeList :items="co.wps.map((wp) => 'WP'+wp)" />
            </TableCell>
            <TableCell class="text-center">
              <BadgeList :items="co.eas.map((ea) => 'EA'+ea)" />
            </TableCell>
            <TableCell class="text-center">
              <CheckIcon class="inline-block" :size="16" v-if="co.sdg" />
              <MinusIcon class="inline-block" :size="16" v-else />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </template>
  </ContentCard>
</template>
