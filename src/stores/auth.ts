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
        console.log(currentUser)
        if (currentUser) {
          // Fetch profile whenever auth state changes to logged in
          userProfile.value = await userService.fetchUserProfile(currentUser.uid);
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

  // Step 1: send sign-in email link
  // async function sendLoginLink(email: string): Promise<void> {
  //   linkSentCountdown.value.linkSent = true
  //   linkSentCountdown.value.countdown = 60
  //   linkSentCountdown.value.timer = setInterval(() => {
  //     linkSentCountdown.value.countdown--
  //     if (linkSentCountdown.value.countdown <= 0) {
  //       clearInterval(linkSentCountdown.value.timer as number)
  //       linkSentCountdown.value.linkSent = false
  //     }
  //   }, 1000)
  //   const actionCodeSettings = {
  //     url: window.location.origin + import.meta.env.VITE_BASE_URL, // must match Firebase config
  //     handleCodeInApp: true,
  //   };
  //   return sendSignInLinkToEmail(auth, email, actionCodeSettings)
  //     .then(() => {
  //       window.localStorage.setItem(FIREBASE_EMAIL_LOCAL_STORAGE_NAME, email);
  //     })
  // }

  // Step 2: when user clicks link and opens your site
  // async function completeSignIn(): Promise<unknown> {
  //   if (isSignInWithEmailLink(auth, window.location.href)) {
  //     let email = window.localStorage.getItem(FIREBASE_EMAIL_LOCAL_STORAGE_NAME);
  //     if (!email) {
  //       email = window.prompt("Please confirm your email for sign-in");
  //     }
  //     console.log(window.location.href)
  //     return signInWithEmailLink(auth, email!, window.location.href)
  //     .then((result) => {
  //       window.localStorage.removeItem(FIREBASE_EMAIL_LOCAL_STORAGE_NAME);
  //       user.value = result.user;
  //       console.log(result.user)
  //       return result.user
  //     })
  //   } else {
  //     return new Promise((resolve, reject) => {
  //       resolve(null)
  //     })
  //   }
  // }

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
    resetPassword
  }
});
