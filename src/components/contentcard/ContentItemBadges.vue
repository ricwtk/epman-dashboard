<script setup lang='ts'>
import { Badge } from '@/components/ui/badge';
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem } from '@/components/ui/context-menu'
import { XIcon } from 'lucide-vue-next';

defineProps<{
  title?: string,
  badges: string[],
  elsemessage?: string,
  editable?: boolean
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
        <ContextMenu v-if="editable">
          <ContextMenuTrigger>
            <Badge variant="secondary">{{ badge }}</Badge>
          </ContextMenuTrigger>
          <ContextMenuContent class="w-fit">
            <ContextMenuItem @click="$emit('delete', badge)">
              <XIcon />
              Delete
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
        <Badge v-else variant="secondary">{{ badge }}</Badge>
      </template>
      <Badge v-if="badges.length == 0"variant="outline">{{ elsemessage }}</Badge>
      <slot></slot>
    </div>
  </div>
</template>
