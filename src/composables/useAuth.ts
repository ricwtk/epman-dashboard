// src/composables/useAuth.js
import { ref } from "vue";
import { auth } from "@/lib/firebase";
import {
  sendSignInLinkToEmail,
  signInWithEmailLink,
  onAuthStateChanged,
  isSignInWithEmailLink
} from "firebase/auth";
import { FIREBASE_EMAIL_LOCAL_STORAGE_NAME } from "@/constants";

export const user = ref(null);

// onAuthStateChanged(auth, (u) => {
//   if (u) {
//     user.value = u
//   }
// });

// Step 1: send sign-in email link
export async function sendLoginLink(email: string): Promise<void> {
  const actionCodeSettings = {
    url: window.location.origin + import.meta.env.VITE_BASE_URL, // must match Firebase config
    handleCodeInApp: true,
  };
  return sendSignInLinkToEmail(auth, email, actionCodeSettings)
    .then(() => {
      window.localStorage.setItem(FIREBASE_EMAIL_LOCAL_STORAGE_NAME, email);
    })
}

// Step 2: when user clicks link and opens your site
export async function completeSignIn(): Promise<unknown> {
  if (isSignInWithEmailLink(auth, window.location.href)) {
    let email = window.localStorage.getItem(FIREBASE_EMAIL_LOCAL_STORAGE_NAME);
    if (!email) {
      email = window.prompt("Please confirm your email for sign-in");
    }
    console.log(window.location.href)
    return signInWithEmailLink(auth, email!, window.location.href)
    .then((result) => {
      window.localStorage.removeItem(FIREBASE_EMAIL_LOCAL_STORAGE_NAME);
      return result.user
    })
  } else {
    return new Promise((resolve, reject) => {
      resolve(null)
    })
  }
}
