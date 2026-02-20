<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import ContentCard from '@/components/contentcard/ContentCard.vue';
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { onMounted, ref } from 'vue';

const authStore = useAuthStore();
const name = ref(authStore.userProfile?.name);
const email = ref(authStore.userProfile?.email);
const dataLevel = ref(authStore.userProfile?.datalevel);
const userLevel = ref(authStore.userProfile?.userlevel);

</script>

<template>
  <ContentCard :editable="false">
    <template #title>
      Profile
    </template>
    <template #body>
      <form>
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
          </Field>
          <Field>
            <FieldLabel for="userlevel">User Access Level</FieldLabel>
          </Field>
        </FieldGroup>
      </form>
    </template>
  </ContentCard>
</template>
