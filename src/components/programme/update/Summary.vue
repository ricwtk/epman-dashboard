<script setup lang="ts">
// import { getEditingProgrammeAndStore } from '@/composables/programme';
// const { programme, editingProgrammeStore } = getEditingProgrammeAndStore();

import { useProgrammeStore } from '@/stores/programme';
const programmeStore = useProgrammeStore();

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import ResetButton from '@/components/ResetButton.vue';

const checkDiff = (fields: string[]) => {
  return programmeStore.checkDiff(fields);
};
const resetDiff = (fields: string[]) => {
  programmeStore.resetDiff(fields);
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
        <Input disabled id="code" placeholder="Programme Code" v-model="programmeStore.draft.code"/>
      </div>

      <div class="flex flex-col gap-1 grow">
        <Label for="name">
          Name
          <ResetButton :disabled="!checkDiff(['name'])" @reset="resetDiff(['name'])" />
        </Label>
        <Input id="name" placeholder="Programme Name" v-model="programmeStore.draft.name"/>
      </div>
    </div>
  </div>
</template>
