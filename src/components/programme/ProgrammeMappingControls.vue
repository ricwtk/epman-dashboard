<script setup lang="ts">
import { ref } from 'vue';
import { ArrowUpDownIcon, Columns3Icon } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuItem, DropdownMenuGroup, DropdownMenuCheckboxItem, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

const visibleColumns = defineModel<{ [key: string]: boolean }>("visibleColumns")
const sorting = defineModel<{ column: string; direction: string }>("sorting")
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" size="icon"><Columns3Icon /></Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>Column visibility</DropdownMenuLabel>
      <DropdownMenuGroup>
        <DropdownMenuCheckboxItem v-model="visibleColumns!.po" @select="(e) => e.preventDefault()">PO</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem v-model="visibleColumns!.wk" @select="(e) => e.preventDefault()">WK</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem v-model="visibleColumns!.wp" @select="(e) => e.preventDefault()">WP</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem v-model="visibleColumns!.ea" @select="(e) => e.preventDefault()">EA</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem v-model="visibleColumns!.sdg" @select="(e) => e.preventDefault()">SDG</DropdownMenuCheckboxItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>

  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" size="icon"><ArrowUpDownIcon /></Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>Sort by</DropdownMenuLabel>
      <DropdownMenuRadioGroup v-model="sorting!.column">
        <DropdownMenuRadioItem value="semester" @select="(e) => e.preventDefault()">Semester</DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="code" @select="(e) => e.preventDefault()">Code</DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="name" @select="(e) => e.preventDefault()">Name</DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
      <DropdownMenuLabel>Sort order</DropdownMenuLabel>
      <DropdownMenuRadioGroup v-model="sorting!.direction">
        <DropdownMenuRadioItem value="asc" @select="(e) => e.preventDefault()">Ascending</DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="desc" @select="(e) => e.preventDefault()">Descending</DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
