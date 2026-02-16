import { defineStore } from 'pinia';
import { ref, type Ref, computed } from 'vue';
import { auth } from '@/lib/firebase'; // Your firebase config file
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  // sendSignInLinkToEmail,
  // signInWithEmailLink,
  signOut,
  sendPasswordResetEmail,
  // isSignInWithEmailLink,
  type User
} from "firebase/auth";
import type { FirebaseError } from "firebase/app"
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {
  const user: Ref<User | null> = ref(null)
  const isReady: Ref<boolean> = ref(false)
  const router = useRouter();

  const isAuthenticated = computed(() => !!user.value);
  // const linkSentCountdown: Ref<{
  //   linkSent: boolean,
  //   countdown: number,
  //   timer: number | null
  // }> = ref({
  //   linkSent: false,
  //   countdown: 0,
  //   timer: null
  // })

  const init = () => {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, (currentUser) => {
        user.value = currentUser;
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
    } catch (error) {
      const firebaseError = error as FirebaseError;
      throw firebaseError;
    }
  };

  // --- NEW: Sign In Action ---
  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      user.value = userCredential.user;
    } catch (error) {
      const firebaseError = error as FirebaseError;
      throw firebaseError;
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
    router.push("/")
  };

  // --- NEW: Reset Password Action ---
  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      const firebaseError = error as FirebaseError;
      throw firebaseError;
    }
  };

  return {
    user,
    isReady,
    isAuthenticated,
    init,
    signUp,
    login,
    logout,
    resetPassword
  }
});
