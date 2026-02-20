import { defineStore } from 'pinia';
import { ref, type Ref, computed } from 'vue';
import { auth } from '@/services/firebase'; // Your firebase config file
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  type User
} from "firebase/auth";
import type { FirebaseError } from "firebase/app"
import { useRouter } from 'vue-router';
import type { UserProfile } from '@/types/user';
import { userService } from '@/services/userService';

export const useAuthStore = defineStore('auth', () => {
  const user: Ref<User | null> = ref(null)
  const userProfile: Ref<UserProfile | null> = ref(null)
  const isReady: Ref<boolean> = ref(false)
  const router = useRouter();

  const isAuthenticated = computed(() => !!user.value);

  // Computed helpers for checking level in UI
  const canEditCourses = computed(() => (userProfile.value?.datalevel || 0) >= 2);
  const canEditProgrammes = computed(() => (userProfile.value?.datalevel || 0) >= 3);
  const canEditSchools = computed(() => (userProfile.value?.datalevel || 0) >= 4);

  const canEditUsers = computed(() => (userProfile.value?.userlevel || 0) >= 2);
  const canCreateUsers = computed(() => (userProfile.value?.userlevel || 0) >= 3);
  const canDeleteUsers = computed(() => (userProfile.value?.userlevel || 0) >= 4);

  const init = () => {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, async (currentUser) => {
        user.value = currentUser;
        if (currentUser) {
          // Fetch profile whenever auth state changes to logged in
          userProfile.value = await userService.fetchUserProfile(currentUser.uid);
          userProfile.value!.uid = currentUser.uid;
          // if (!userProfile.value) {
          //   await userService.createUserProfile(currentUser.uid, currentUser.email || "");
          //   userProfile.value = await userService.fetchUserProfile(currentUser.uid);
          // }
        } else {
          userProfile.value = null;
        }
        isReady.value = true;
        resolve(currentUser);
      });
    });
  };

  // --- NEW: Sign Up Action ---
  const signUp = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      user.value = userCredential.user;

      await userService.createUserProfile(user.value.uid, email);
    } catch (error) {
      throw error as FirebaseError;
    }
  };

  // --- NEW: Sign In Action ---
  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      user.value = userCredential.user;
    } catch (error) {
      throw error as FirebaseError;
    }
  };

  // --- NEW: Sign Out Action ---
  const logout = async () => {
    await signOut(auth);
    user.value = null;
    userProfile.value = null;
    router.push("/")
  };

  // --- NEW: Reset Password Action ---
  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw error as FirebaseError;
    }
  };

  const updateUserProfile = async (profile: Omit<UserProfile, "uid">) => {
    try {
      userProfile.value!.name = profile.name;
      await userService.setUserProfile(
        userProfile.value!.uid,
        userProfile.value!
      );
    } catch (error) {
      throw error as FirebaseError;
    }
  };

  return {
    user,
    userProfile,
    isReady,
    isAuthenticated,
    canEditCourses,
    canEditProgrammes,
    canEditSchools,
    canEditUsers,
    canCreateUsers,
    canDeleteUsers,
    init,
    signUp,
    login,
    logout,
    resetPassword,
    updateUserProfile
  }
});
