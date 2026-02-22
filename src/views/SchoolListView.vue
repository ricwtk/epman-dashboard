<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { getSchoolList, createNewSchool } from '@/utils/schoolHelpers';
import ContentCard from '@/components/contentcard/ContentCard.vue';
import { Button } from '@/components/ui/button';
import NavIndicator from '@/components/NavIndicator.vue';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { PlusIcon } from 'lucide-vue-next';

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

const newSchoolName = ref('');
const newSchoolCode = ref('');
const newSchoolError = ref('');
watch(newSchoolCode, (oldValue, newValue) => {
  if (schools.value.map((school) => school.code.toUpperCase()).includes(oldValue.toUpperCase())) {
    newSchoolError.value = 'School code already exists';
  } else {
    newSchoolError.value = '';
  }
});

const addNewSchool = async () => {
  const newSchoolParameters = {
    name: newSchoolName.value,
    code: newSchoolCode.value.toUpperCase(),
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
      <Popover v-if="authStore.canEditSchools">
        <PopoverTrigger as-child>
          <Button
            variant="outline"
            size="icon"
          >
            <PlusIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent class="w-80">
          <div class="grid gap-4">
            <div class="space-y-2">
              <h4 class="font-medium leading-none">
                New School
              </h4>
              <p class="text-sm text-muted-foreground">
                Create new school
              </p>
            </div>
            <div class="grid gap-2">
              <div class="grid grid-cols-3 items-center gap-4">
                <Label for="name">Name</Label>
                <Input
                  id="name"
                  class="col-span-2 h-8"
                  v-model="newSchoolName"
                />
              </div>
              <div class="grid grid-cols-3 items-center gap-4">
                <Label for="code">Code</Label>
                <Input :variant="newSchoolError !== '' ? 'error' : 'default'"
                  id="code"
                  class="col-span-2 h-8 uppercase"
                  v-model="newSchoolCode"
                />
              </div>
              <div class="grid grid-cols-3 items-center gap-4" v-if="newSchoolError !== ''">
                <div></div>
                <div class="col-span-2 text-sm text-red-500">
                  {{ newSchoolError }}
                </div>
              </div>

              <Button @click="addNewSchool"
                :disabled="newSchoolError !== '' || newSchoolName === '' || newSchoolCode === ''"
              >
                  <PlusIcon/>Create School
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
    </template>
  </ContentCard>
</template>
