<script setup lang="ts">
import ContentCard from '@/components/contentcard/ContentCard.vue';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AccessLevelSelector from '@/components/useradmin/AccessLevelSelector.vue';
import { ChevronUpIcon, ChevronDownIcon, InfoIcon } from 'lucide-vue-next';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table';
import { Spinner } from '@/components/ui/spinner';
import UserRow from '@/components/useradmin/UserRow.vue';

import { ref, onMounted, computed } from 'vue';
import { DATALEVEL_OPTIONS, USERLEVEL_OPTIONS } from '@/constants';
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();

import { useUserAdministrationStore } from '@/stores/useradministration';
const userAdministrationStore = useUserAdministrationStore();

onMounted(async () => {
  await userAdministrationStore.getUserListFromDb()
})

const ownProfileIndex = computed(() => {
  return userAdministrationStore.userList.findIndex(user => user.email === authStore.user!.email)
})

const showCreateUser = ref(false)
const createUser = async () => {
  // TODO: Implement user creation logic
  // newUser.value = await createNewProfile()
};

</script>

<template>
  <ContentCard :editable="false" v-if="authStore.canCreateUsers">
    <template #title>Create New User</template>
    <template #actions>
      <Button variant="ghost" size="icon" @click="showCreateUser = !showCreateUser">
        <ChevronUpIcon v-if="showCreateUser" />
        <ChevronDownIcon v-else />
      </Button>
    </template>
    <template #body>
      <form @submit.prevent="createUser" v-if="userAdministrationStore.newUser && showCreateUser">
         <FieldGroup>
          <Field>
            <FieldLabel for="email">Email:</FieldLabel>
            <Input type="email" id="email" v-model="userAdministrationStore.newUser.email" required />
          </Field>
          <Field>
            <FieldLabel for="name">Name:</FieldLabel>
            <Input type="text" id="name" v-model="userAdministrationStore.newUser.name" required />
          </Field>
          <Field>
            <FieldLabel for="datalevel">Data Access Level</FieldLabel>
            <AccessLevelSelector
              v-model="userAdministrationStore.newUser.datalevel"
              :options="DATALEVEL_OPTIONS"
            />
          </Field>
          <Field>
            <FieldLabel for="userlevel">User Access Level</FieldLabel>
            <AccessLevelSelector
              v-model="userAdministrationStore.newUser.userlevel"
              :options="USERLEVEL_OPTIONS"
            />
          </Field>
          <Field>
            <div class="flex flex-row justify-end">
              <Button type="submit" variant="default">Create User</Button>
            </div>
          </Field>
        </FieldGroup>
      </form>
      <div v-else>
        <Alert class="border-0">
          <InfoIcon />
          <AlertTitle>Expand to show user creation form</AlertTitle>
        </Alert>
      </div>
    </template>
  </ContentCard>

  <ContentCard :editable="false">
    <template #title>Existing Users</template>
    <template #body>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead class="text-center">Data Access Level</TableHead>
            <TableHead class="text-center">User Access Level</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <UserRow v-if="userAdministrationStore.changes[ownProfileIndex]"
            :changes="userAdministrationStore.changes[ownProfileIndex]!.length > 0 || false"
            v-model="userAdministrationStore.userList[ownProfileIndex]!"
            :disabled="{
              name: false,
              email: true,
              datalevel: true,
              userlevel: true
            }"
          />
          <template v-for="user, userIndex in userAdministrationStore.userList" :key="user.uid">
            <UserRow
               v-if="userIndex !== ownProfileIndex"
              :changes="userAdministrationStore.changes[userIndex]!.length > 0"
              v-model="userAdministrationStore.userList[userIndex]!"
              :disabled="{
                name: !authStore.canEditUsers,
                email: true,
                datalevel: !authStore.canEditUsers,
                userlevel: !authStore.canEditUsers
              }"
            />
          </template>
        </TableBody>
      </Table>
      <div class="flex justify-end mt-2" v-if="userAdministrationStore.changes.some(changes => changes.length > 0)">
        <Button @click="userAdministrationStore.saveChanges" variant="default">
          <Spinner v-if="userAdministrationStore.loading" />
          Save changes
        </Button>
      </div>
    </template>
  </ContentCard>
</template>
