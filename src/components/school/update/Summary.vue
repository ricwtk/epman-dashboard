<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { getEditingSchoolAndStore } from '@/composables/school';
const { school, editingSchoolStore } = getEditingSchoolAndStore();
const { programmeToSchoolMap } = storeToRefs(editingSchoolStore);

import { formatRevision } from '@/utils/common';
import { dataService, type MappedProgramme } from '@/services/dataService';
import { createNewProgramme } from '@/utils/programmeHelpers';
import { navigateToProgrammeExternal } from '@/utils/navigationHelpers';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ButtonGroup, ButtonGroupText } from '@/components/ui/button-group';
import { Button } from '@/components/ui/button';
import { SquareArrowOutUpRightIcon, XIcon } from 'lucide-vue-next';
import ResetButton from '@/components/ResetButton.vue';
import CreateNewPopover from '@/components/CreateNewPopover.vue';
import NewOrAddPopover from '@/components/NewOrAddPopover.vue';

import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();

const checkDiff = (fields: string[]) => {
  return editingSchoolStore.checkDiff(fields);
};
const resetDiff = (fields: string[]) => {
  editingSchoolStore.resetDiff(fields);
};

const programmesAssignedToSchools = computed(() => {
  let programmes = Object.keys(programmeToSchoolMap.value)
    .filter(code => programmeToSchoolMap.value[code]?.school.code !== "")
    .map(code => ({
      code,
      name: programmeToSchoolMap.value[code]?.name || "",
      school: programmeToSchoolMap.value[code]?.school,
    }));
  editingSchoolStore.addedProgrammes.forEach(code => {
    programmes.push({
      code,
      name: programmeToSchoolMap.value[code]?.name || "",
      school: school.value
    });
  });
  editingSchoolStore.removedProgrammes.forEach(code => {
    const index = programmes.findIndex(p => p.code === code);
    if (index !== -1) programmes.splice(index, 1);
  });
  return programmes;
})

const programmesNotAssignedToSchools = computed(() => {
  let programmes = Object.keys(programmeToSchoolMap.value)
    .filter(code => programmeToSchoolMap.value[code]?.school.code === "")
    .map(code => ({
      code,
      name: programmeToSchoolMap.value[code]?.name || "",
      school: programmeToSchoolMap.value[code]?.school,
    }));
  editingSchoolStore.removedProgrammes.forEach(code => {
    if (programmeToSchoolMap.value[code]?.name) {
      programmes.push({
        code,
        name: programmeToSchoolMap.value[code]?.name,
        school: { code: "", name: "" }
      });
    }
  });
  editingSchoolStore.addedProgrammes.forEach(code => {
    const index = programmes.findIndex(p => p.code === code);
    if (index !== -1) programmes.splice(index, 1);
  });
  return programmes;
})

const addNewProgramme = async (newName: string, newCode: string) => {
  if (!Object.keys(programmeToSchoolMap.value).includes(newCode)) {
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
    await dataService.saveProgramme(newProgramme);
    await editingSchoolStore.updateProgrammeToSchoolMap();
    // await updateProgrammes();
  }
  school.value.programmes.push(newCode);
}

const addExistingProgramme = async (code: string) => {
  school.value.programmes.push(code);
}

const getAdditionalError = (name: string, code: string, bannedItem?: { code: string, name: string, school?: { code: string, name: string } }) => {
  let error = "";
  console.log(bannedItem)
  if (bannedItem) {
    error += `Programme ${code} already exists`
    if (bannedItem.school!.code == school.value.code) {
      error = `${error} and assigned to the current school`;
    } else {
      error = `${error} and assigned to other school`;
    }
  }
  return error;
}

const removeProgramme = (code: string) => {
  const index = school.value.programmes.indexOf(code);
  if (index !== -1) {
    school.value.programmes.splice(index, 1);
  }
}
</script>

<template>
  <div class="w-full flex flex-col gap-2">
    <div class="flex flex-col sm:flex-row gap-2">
      <div class="flex flex-col gap-1 grow">
        <Label for="code">Code</Label>
        <div class="flex flex-row gap-2">
          <Input id="code" placeholder="School Code" v-model="school.code" disabled/>
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

    <div class="flex flex-col gap-1">
      <Label>Programme List</Label>
      <div class="flex flex-row flex-wrap gap-2">
        <ResetButton v-if="checkDiff(['programmes'])" @reset="resetDiff(['programmes'])" />
        <!-- <div v-for="programme in 10" :key="programme" class="flex flex-row justify-center"> -->
        <template v-for="pCode in school.programmes" :key="pCode">
          <div
            class="flex flex-row justify-center"
          >
            <ButtonGroup class="gap-0!">
              <ButtonGroupText class="max-w-50">
                <span class="truncate"
                  :title="programmeToSchoolMap[pCode]?.name"
                >
                  {{ pCode }} {{ programmeToSchoolMap[pCode]?.name }}
                </span>
              </ButtonGroupText>
              <Button variant="outline" size="icon" @click="navigateToProgrammeExternal(pCode)"><SquareArrowOutUpRightIcon /></Button>
              <Button variant="outline" size="icon" @click="removeProgramme(pCode)"><XIcon /></Button>
            </ButtonGroup>
          </div>
        </template>

        <NewOrAddPopover
          :bannedList="programmesAssignedToSchools"
          :availableList="programmesNotAssignedToSchools"
          :errorMessageFcn="getAdditionalError"
          title="New Programme"
          description="Add or Create programme"
          @create="addNewProgramme"
          @add="addExistingProgramme"
        >
        </NewOrAddPopover>
      </div>
    </div>
  </div>
</template>
