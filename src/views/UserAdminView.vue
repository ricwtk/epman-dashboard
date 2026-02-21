<script setup lang="ts">
import ContentCard from '@/components/contentcard/ContentCard.vue';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AccessLevelSelector from '@/components/AccessLevelSelector.vue';
import { ChevronUpIcon, ChevronDownIcon, InfoIcon } from 'lucide-vue-next';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table';

import { ref, onMounted } from 'vue';
import { type UserProfile } from '@/types/user';
import { createNewProfile } from '@/utils/userHelpers';
import { userService } from '@/services/userService';
import { DATALEVEL_OPTIONS, USERLEVEL_OPTIONS } from '@/constants';

const newUser = ref<UserProfile | null>(null)
const userList = ref<UserProfile[]>([])
onMounted(async () => {
  newUser.value = await createNewProfile()
  userList.value = await userService.fetchUserProfiles()
})

const showCreateUser = ref(false)
const createUser = async () => {
  // TODO: Implement user creation logic
  newUser.value = await createNewProfile()
};
</script>

<template>
  <ContentCard :editable="false">
    <template #title>Create New User</template>
    <template #actions>
      <Button variant="ghost" size="icon" @click="showCreateUser = !showCreateUser">
        <ChevronUpIcon v-if="showCreateUser" />
        <ChevronDownIcon v-else />
      </Button>
    </template>
    <template #body>
      <form @submit.prevent="createUser" v-if="newUser && showCreateUser">
         <FieldGroup>
          <Field>
            <FieldLabel for="email">Email:</FieldLabel>
            <Input type="email" id="email" v-model="newUser!.email" required />
          </Field>
          <Field>
            <FieldLabel for="name">Name:</FieldLabel>
            <Input type="text" id="name" v-model="newUser!.name" required />
          </Field>
          <Field>
            <FieldLabel for="datalevel">Data Access Level</FieldLabel>
            <AccessLevelSelector
              v-model="newUser!.datalevel"
              :options="DATALEVEL_OPTIONS"
            />
          </Field>
          <Field>
            <FieldLabel for="userlevel">User Access Level</FieldLabel>
            <AccessLevelSelector
              v-model="newUser!.userlevel"
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
    <template #title>Existing User</template>
    <template #body>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Data Access Level</TableHead>
            <TableHead>User Access Level</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="user in userList" :key="user.id">
            <TableCell>{{ user.name }}</TableCell>
            <TableCell>{{ user.email }}</TableCell>
            <TableCell>
              <AccessLevelSelector
                v-model="user.datalevel"
                :options="DATALEVEL_OPTIONS"

              />
            </TableCell>
            <TableCell>
              <AccessLevelSelector
                v-model="user.userlevel"
                :options="USERLEVEL_OPTIONS"
                size="small"
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </template>
  </ContentCard>
</template>
