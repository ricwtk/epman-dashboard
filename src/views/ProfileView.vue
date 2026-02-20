<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import ContentCard from '@/components/contentcard/ContentCard.vue';
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { computed, ref } from 'vue';
import { DATALEVEL_OPTIONS, USERLEVEL_OPTIONS } from '@/constants';
import AccessLevelSelector from '@/components/AccessLevelSelector.vue';
import { Button } from '@/components/ui/button';
import { updateProfile } from '@/utils/userHelpers';

const authStore = useAuthStore();
const name = ref(authStore.userProfile?.name || "");
const email = ref(authStore.userProfile?.email || "");
const dataLevel = ref(authStore.userProfile?.datalevel || 1);
const userLevel = ref(authStore.userProfile?.userlevel || 1);

async function saveProfile() {
  await authStore.updateUserProfile(
    await updateProfile(authStore.userProfile!, {
      name: name.value,
    })
  );
}

const diff = computed(() => {
  return name.value !== authStore.userProfile?.name
});
</script>

<template>
  <ContentCard :editable="false">
    <template #title>
      Profile
    </template>
    <template #body>
      <form @submit.prevent="saveProfile">
        <FieldGroup>
          <Field>
            <FieldLabel for="name">Display Name</FieldLabel>
            <Input id="name" type="text" v-model="name" />
          </Field>
          <Field>
            <FieldLabel for="email">Email</FieldLabel>
            <Input disabled id="email" type="email" v-model="email" />
          </Field>
          <Field>
            <FieldLabel for="datalevel">Data Access Level</FieldLabel>
            <AccessLevelSelector
              v-model="dataLevel"
              :options="DATALEVEL_OPTIONS"
              :disabled="true"
            />
          </Field>
          <Field>
            <FieldLabel for="userlevel">User Access Level</FieldLabel>
            <AccessLevelSelector
              v-model="userLevel"
              :options="USERLEVEL_OPTIONS"
              :disabled="true"
            />
          </Field>
        </FieldGroup>
        <Field v-if="diff">
          <div class="flex flex-row items-center justify-end">
            <Button type="submit" variant="default">Save</Button>
          </div>
        </Field>
      </form>
    </template>
  </ContentCard>
</template>
