import { defineStore } from 'pinia';
import { type UserProfile } from '@/types/user';
import { computed, ref, toRaw } from 'vue';
import { userService } from '@/services/userService';
import { createNewProfile } from '@/utils/userHelpers';
import diff from 'microdiff';

export const useUserAdministrationStore = defineStore('user-administration', () => {
  const newUser = ref<UserProfile>(createNewProfile());
  const newUserList = ref<UserProfile[]>([]);
  const userList = ref<UserProfile[]>([]);
  const originalUserList = ref<UserProfile[]>([]);
  const loading = ref(false);

  const changes = computed(() => {
    return userList.value.map((user, index) => {
      return index < originalUserList.value.length ? diff(originalUserList.value[index] || {}, user) : [];
    });
  });

  async function getUserListFromDb() {
    originalUserList.value = await userService.fetchUserProfiles();
    userList.value = structuredClone(toRaw(originalUserList.value));
  }

  function resetUserList() {
    userList.value = structuredClone(toRaw(originalUserList.value));
  }

  function commitChanges() {
    originalUserList.value = structuredClone(toRaw(userList.value));
  }

  async function saveChanges() {
    loading.value = true;
    await userService.updateUserProfiles(userList.value);
    commitChanges();
    loading.value = false;
  }

  function addNewUserToList() {
    if (userList.value.map(user => user.email).includes(newUser.value.email)) {
      return "User with this email already exists";
    } else if (newUserList.value.map(user => user.email).includes(newUser.value.email)) {
      return "User with this email already exists in the queue";
    } else {
      newUserList.value.push(newUser.value);
      newUser.value = createNewProfile();
    }
  }

  return {
    newUser,
    newUserList,
    userList,
    originalUserList,
    loading,
    changes,
    getUserListFromDb,
    resetUserList,
    addNewUserToList,
    saveChanges,
  };
});
