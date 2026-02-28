<script setup lang="ts">
import { ref, onMounted, type Ref } from 'vue';
import { getProgrammeList, createNewProgramme } from '@/utils/programmeHelpers';
import ContentCard from '@/components/contentcard/ContentCard.vue';
import { Button } from '@/components/ui/button';
import NavIndicator from '@/components/NavIndicator.vue';
import CreateNewPopover from '@/components/CreateNewPopover.vue';

import { navigateToProgramme } from '@/utils/navigationHelpers';
import { formatRevision, getSortedUniqueLatestPartial } from '@/utils/common';
import { dataService } from '@/services/dataService';

import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();

const programmes = ref<{ code: string, name: string }[]>([]);
async function updateProgrammeList() {
  programmes.value = Object.entries(await dataService.getProgrammes())
    .map(([code, programme]) => ({ code, name: programme.name }))
    .sort((a, b) => a.code.localeCompare(b.code));
}
onMounted(async () => {
  await updateProgrammeList();
});

const addNewProgramme = async (newName: string, newCode: string) => {
  const newProgrammeParameters = {
    name: newName,
    code: newCode.toUpperCase(),
    revision: formatRevision(),
    committed: {
      on: new Date(),
      by: authStore.user?.email || 'unknown'
    }
  };
  const newProgramme = createNewProgramme(newProgrammeParameters);
  try {
    await dataService.saveProgramme(newProgramme);
    await updateProgrammeList();
  } catch (error) {
    console.error('Error saving programme:', error);
  }
}
</script>

<template>
  <NavIndicator :items="[
    { label: 'Home', path: '/' },
    { label: 'Programme', path: '/programme' }
  ]"/>

  <ContentCard :editable="false">
    <template #title>
      Programme List
    </template>
    <template #body>
      <div class="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-4
        xl:grid-cols-5
        2xl:grid-cols-6
        gap-2
      ">
        <template v-for="programme in programmes" :key="programme.code">
          <Button
            variant="default"
            @click="navigateToProgramme(programme.code)"
          >
            {{ programme.code }} {{ programme.name }}
          </Button>
        </template>
        <CreateNewPopover v-if="authStore.canEditProgrammes"
          :currentList="programmes.map(programme => programme.code)"
          @create="(name:string, code:string) => addNewProgramme(name, code)"
        >
          <template #title>
            New Programme
          </template>
          <template #description>
            Create new programme
          </template>
        </CreateNewPopover>
      </div>
    </template>
  </ContentCard>
</template>
