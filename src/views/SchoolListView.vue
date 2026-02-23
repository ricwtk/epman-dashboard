<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { getSchoolList, createNewSchool } from '@/utils/schoolHelpers';
import ContentCard from '@/components/contentcard/ContentCard.vue';
import { Button } from '@/components/ui/button';
import NavIndicator from '@/components/NavIndicator.vue';
import CreateNewPopover from '@/components/CreateNewPopover.vue';

import { navigateToSchool } from '@/utils/navigationHelpers';
import { formatRevision } from '@/utils/common';
import { dataService } from '@/services/dataService';

import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();

const schools = ref<{ code: string, name: string }[]>([]);
async function updateSchoolList() {
  // schools.value = getSchoolList();
  schools.value = await dataService.getSchools();
  // get unique schools with same codes
  schools.value = Array.from(new Set(schools.value.map((school) => school.code.toUpperCase()))).map((code) => {
    const school = schools.value.find((school) => school.code.toUpperCase() === code);
    return { code, name: school?.name || '' };
  });
  schools.value.sort((a, b) => a.code.localeCompare(b.code));
}
onMounted(async () => {
  await updateSchoolList();
});

const addNewSchool = async (newName: string, newCode: string) => {
  const newSchoolParameters = {
    name: newName,
    code: newCode.toUpperCase(),
    revision: formatRevision(),
    committed: {
      on: new Date(),
      by: authStore.user?.email || 'unknown'
    }
  };
  const newSchool = createNewSchool(newSchoolParameters);
  try {
    await dataService.saveSchool(newSchool);
    await updateSchoolList();
  } catch (error) {
    console.error('Error saving school:', error);
  }
};
</script>

<template>
  <NavIndicator :items="[
    { label: 'Home', path: '/' },
    { label: 'School', path: '/school' }
  ]"/>

  <ContentCard :editable="false">
    <template #title>
      Schools
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
      <template v-for="school in schools" :key="school.code">
        <Button
          variant="default"
          @click="navigateToSchool(school.code)"
        >
          {{ school.code }} {{ school.name }}
        </Button>
      </template>
      <CreateNewPopover v-if="authStore.canEditSchools"
        :currentList="schools.map(school => school.code)"
        @create="(name:string, code:string) => addNewSchool(name, code)"
      >
        <template #title>
          New School
        </template>
        <template #description>
          Create new school
        </template>
      </CreateNewPopover>
    </div>
    </template>
  </ContentCard>
</template>
