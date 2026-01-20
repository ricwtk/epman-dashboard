<script setup lang="ts">
import { computed } from 'vue';
import { type Reference } from '@/lib/course';
import ContentCard from '@/components/contentcard/ContentCard.vue';
import {
  Table,
  TableBody,
  TableRow,
  TableCell
} from '@/components/ui/table';

const props = defineProps<{ references: Reference[]; editing: boolean }>();
const emit = defineEmits(['update:editing']);

const mainReferences = computed(() => props.references.filter(reference => reference.label === 'main'));
const additionalReferences = computed(() => props.references.filter(reference => reference.label === 'additional'));
</script>

<template>
  <ContentCard editable :editing="editing" @update:editing="$emit('update:editing', $event)">
    <template #title>
      Main Reference
    </template>
    <template #body>
      <Table>
        <TableBody>
          <TableRow v-for="(reference, index) in mainReferences" :key="index">
            <TableCell>{{ reference.description }}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </template>
  </ContentCard>

  <ContentCard editable>
    <template #title>
      Additional References
    </template>
    <template #body>
      <Table>
        <TableBody>
          <TableRow v-for="(reference, index) in additionalReferences" :key="index">
            <TableCell>{{ reference.description }}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </template>
  </ContentCard>
</template>
