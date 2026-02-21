<script setup lang="ts">
import { TableHead, TableRow } from '@/components/ui/table';

interface UserHeadRowProps {
  info?: {
    show?: boolean,
    header?: string
  }
}
const props = withDefaults(defineProps<UserHeadRowProps>(), {
  info: () => ({
    show: false,
    header: ''
  })
});

</script>

<template>
  <TableRow>
    <TableHead v-if="props.info?.show">{{ props.info?.header }}</TableHead>
    <TableHead>Name</TableHead>
    <TableHead>Email</TableHead>
    <TableHead class="text-center">Data Access Level</TableHead>
    <TableHead class="text-center">User Access Level</TableHead>
  </TableRow>
</template>
