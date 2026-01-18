<script setup lang="ts">
import ContentCard from '@/components/contentcard/ContentCard.vue';
import { type Assessment } from '@/lib/course'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '@/components/ui/table';
import { CheckIcon } from 'lucide-vue-next';

defineProps<{
  assessments: Assessment[] | undefined;
  coCount: number;
}>();
</script>

<template>
  <ContentCard editable>
    <template #title>
      Assessments
    </template>
    <template #body>
      <div v-if="assessments">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead class="font-bold">Method</TableHead>
              <TableHead class="font-bold cell-center">Weightage</TableHead>
              <TableHead class="font-bold cell-center" v-for="index in coCount" :key="index">CO{{ index }}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="assessment in assessments" :key="assessment.id">
              <TableCell>{{ assessment.description }}</TableCell>
              <TableCell class="cell-center">{{ assessment.weightage }}</TableCell>
              <TableCell class="cell-center"
                v-for="index in coCount"
                :key="index"
              >
                <CheckIcon :size="16" v-if="assessment.cos.includes(index)"></CheckIcon>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </template>
  </ContentCard>
</template>

<style scoped>
.cell-center {
  text-align: center;
}
</style>
