<script setup lang="ts">
import { getEditingSchoolAndStore } from '@/composables/school';
const { school } = getEditingSchoolAndStore();

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
</script>

<template>
  <div class="w-full flex flex-col gap-2">
    <div class="flex flex-col sm:flex-row gap-2">
      <div class="flex flex-col gap-1 grow">
        <Label for="code">Code</Label>
        <Input disabled id="code" placeholder="School Code" v-model="school.code"/>
      </div>

      <div class="flex flex-col gap-1 grow">
        <Label for="name">Name</Label>
        <Input disabled id="name" placeholder="School Name" v-model="school.name"/>
      </div>
    </div>
  </div>
</template>
