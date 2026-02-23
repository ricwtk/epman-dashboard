<script setup lang="ts">
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuGroup, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

defineProps<{
  current: string;
  options: string[];
}>();
defineEmits<{
  (e: 'selected', value: string): void;
}>();
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Badge>{{ current }}</Badge>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="text-xs">
      <DropdownMenuGroup>
        <DropdownMenuItem v-for="opt in options" @click="$emit('selected', opt)">
          {{ opt }}
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
