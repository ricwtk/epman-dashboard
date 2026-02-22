<script setup lang="ts">
import { getEditingSchoolAndStore } from '@/composables/school';
const { school, editingSchoolStore } = getEditingSchoolAndStore();

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import ResetButton from '@/components/ResetButton.vue';

const checkDiff = (fields: string[]) => {
  return editingSchoolStore.checkDiff(fields);
};
const resetDiff = (fields: string[]) => {
  editingSchoolStore.resetDiff(fields);
};
</script>

<template>
  <div class="w-full flex flex-col gap-2">
    <div class="flex flex-col sm:flex-row gap-2">
      <div class="flex flex-col gap-1 grow">
        <Label for="code">Code</Label>
        <div class="flex flex-row gap-2">
          <Input id="code" placeholder="School Code" v-model="school.code"/>
          <ResetButton v-if="checkDiff(['code'])" @reset="resetDiff(['code'])" />
        </div>
      </div>

      <div class="flex flex-col gap-1 grow">
        <Label for="name">Name</Label>
        <div class="flex flex-row gap-2">
          <Input id="name" placeholder="School Name" v-model="school.name"/>
          <ResetButton v-if="checkDiff(['name'])" @reset="resetDiff(['name'])" />
        </div>
      </div>
    </div>
  </div>
</template>
