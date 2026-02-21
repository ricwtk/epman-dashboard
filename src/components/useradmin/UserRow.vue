<script setup lang="ts">
import type { UserProfile } from '@/types/user';
import { DATALEVEL_OPTIONS, USERLEVEL_OPTIONS } from '@/constants';
import { TableRow, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import AccessLevelSelector from '@/components/useradmin/AccessLevelSelector.vue';
import type { Component } from 'vue';

const user = defineModel<UserProfile>({
  required: true,
  default: () => ({
    uid: '',
    name: '',
    email: '',
    datalevel: 1,
    userlevel: 1
  })
})

interface Props {
  changes?: boolean,
  disabled?: {
    name?: boolean,
    email?: boolean,
    datalevel?: boolean,
    userlevel?: boolean
  }
  info?: {
    show?: boolean,
    icon?: Component,
    iconClass?: string,
    title?: string,
    message?: string
  }
}
const props = withDefaults(defineProps<Props>(), {
  changes: false,
  disabled: () => ({
    name: false,
    email: false,
    datalevel: false,
    userlevel: false
  }),
  info: () => ({
    show: false,
    title: '',
    message: ''
  })
})
</script>

<template>
  <TableRow
    :class="{ 'bg-amber-100 hover:bg-amber-200': props.changes }"
  >
    <TableCell v-if="props.info.show">
      <component :is="props.info.icon" :class="props.info.iconClass" v-if="props.info.message"/>
    </TableCell>
    <TableCell v-if="props.disabled.name">
      {{ user.name }}
    </TableCell>
    <TableCell v-else>
      <Input v-model="user.name" :disabled="props.disabled.name"></Input>
    </TableCell>
    <TableCell>{{ user.email }}</TableCell>
    <TableCell>
      <AccessLevelSelector
        v-model="user.datalevel"
        :options="DATALEVEL_OPTIONS"
        size="small"
        :disabled="props.disabled.datalevel"
      />
    </TableCell>
    <TableCell>
      <AccessLevelSelector
        v-model="user.userlevel"
        :options="USERLEVEL_OPTIONS"
        size="small"
        :disabled="props.disabled.userlevel"
      />
    </TableCell>
  </TableRow>
</template>
