import { defineStore } from 'pinia';
import { type UserProfile } from '@/types/user';
import { computed, ref, toRaw } from 'vue';
import { userService } from '@/services/userService';
import { createNewProfile } from '@/utils/userHelpers';
import diff from 'microdiff';

export const useUserAdministrationStore = defineStore('user-administration', () => {
  const newUser = ref<UserProfile>(createNewProfile());
  const newUserList = ref<UserProfile[]>([]);
  const newUserListMessages = ref<string[]>([]);
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
      newUserListMessages.value.push("")
      newUser.value = createNewProfile();
    }
  }

  function removeNewUserFromList(userIndex: number) {
    newUserList.value.splice(userIndex, 1);
    newUserListMessages.value.splice(userIndex, 1);
  }

  async function createNewUsers() {
    const newProfiles = await userService.batchCreateUserProfiles(newUserList.value);
    const createdProfiles = newProfiles.results.filter(result => result.status == "success");
    userList.value.push(...createdProfiles.map(result => result.profile));
    const uncreatedProfiles = newProfiles.results.filter(result => result.status == "error")
    newUserList.value = uncreatedProfiles.map(result => result.profile);
    newUserListMessages.value = uncreatedProfiles.map(result => result.error || "") ;
  }

  async function deleteUser(userIndex: number) {
    if (userIndex < 0 || userIndex >= userList.value.length) return;
    const user = userList.value[userIndex];
    try {
      const response = await userService.deleteUser(user!.uid);
      if (response.success) {
        userList.value.splice(userIndex, 1);
        originalUserList.value.splice(userIndex, 1);
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  }

  return {
    newUser,
    newUserList,
    newUserListMessages,
    userList,
    originalUserList,
    loading,
    changes,
    getUserListFromDb,
    resetUserList,
    addNewUserToList,
    removeNewUserFromList,
    saveChanges,
    createNewUsers,
    deleteUser,
  };
});
