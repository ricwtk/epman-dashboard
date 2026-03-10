<script setup lang='ts'>
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { XIcon } from 'lucide-vue-next';

defineProps<{
  title?: string,
  badges: string[],
  elsemessage?: string,
  editable?: boolean
  displayFcn?: (badge: string) => string,
}>();
defineEmits<{
  (e: "delete", value: string): void
}>();
</script>

<template>
  <div v-if="badges && badges.length > 0 || elsemessage">
    <div class="content-item-title" v-if="title">{{ title }}</div>
    <div class="flex flex-wrap gap-1">
      <template v-for="badge, badge_index in badges">
        <DropdownMenu v-if="editable">
          <DropdownMenuTrigger>
            <Badge variant="secondary">{{ displayFcn ? displayFcn(badge) : badge }}</Badge>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem variant="destructive" @click="$emit('delete', badge)" class="text-xs">
              <XIcon />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Badge v-else variant="secondary">{{ displayFcn ? displayFcn(badge) : badge }}</Badge>
      </template>
      <Badge v-if="badges.length == 0"variant="outline">{{ elsemessage }}</Badge>
      <slot></slot>
    </div>
  </div>
</template>
