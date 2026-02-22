<script setup lang="ts">
import { TableHead, TableRow } from '@/components/ui/table';
</script>

<template>
  <TableRow>
    <slot name="prefix"></slot>
    <TableHead>Name</TableHead>
    <TableHead>Email</TableHead>
    <TableHead class="text-center">Data Access Level</TableHead>
    <TableHead class="text-center">User Access Level</TableHead>
    <slot name="postfix"></slot>
  </TableRow>
</template>
