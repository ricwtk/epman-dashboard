<script setup lang="ts">
import { navigateToPath } from '@/utils/navigationHelpers';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
defineProps<{
  items: { label: string, path: string }[]
}>();
</script>

<template>
<div class="card-plain px-4">
  <Breadcrumb>
    <BreadcrumbList>
      <template v-for="(item, index) in items" :key="index">
        <BreadcrumbItem>
          <BreadcrumbLink @click="navigateToPath(item.path)">
            {{ item.label }}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator v-if="index < items.length - 1"/>
      </template>
    </BreadcrumbList>
  </Breadcrumb>
</div>
</template>
