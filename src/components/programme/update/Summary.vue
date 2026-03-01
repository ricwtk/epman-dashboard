<script setup lang="ts">
import { getEditingProgrammeAndStore } from '@/composables/programme';
const { programme, editingProgrammeStore } = getEditingProgrammeAndStore();

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import ResetButton from '@/components/ResetButton.vue';

const checkDiff = (fields: string[]) => {
  return editingProgrammeStore.checkDiff(fields);
};
const resetDiff = (fields: string[]) => {
  editingProgrammeStore.resetDiff(fields);
};
</script>

<template>
  <div class="w-full flex flex-col gap-2">
    <div class="flex flex-col sm:flex-row gap-2">
      <div class="flex flex-col gap-1 grow">
        <Label for="code">
          Code
          <ResetButton :disabled="!checkDiff(['code'])" @reset="resetDiff(['code'])" />
        </Label>
        <Input disabled id="code" placeholder="Programme Code" v-model="programme.code"/>
      </div>

      <div class="flex flex-col gap-1 grow">
        <Label for="name">
          Name
          <ResetButton :disabled="!checkDiff(['name'])" @reset="resetDiff(['name'])" />
        </Label>
        <Input id="name" placeholder="Programme Name" v-model="programme.name"/>
      </div>
    </div>
  </div>
</template>
