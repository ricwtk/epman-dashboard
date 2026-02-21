import { db } from '@/services/firebase'; // Assumes initialized Firestore instance
import {
  doc,
  getDoc,
  getDocs,
  collection,
  setDoc,
  deleteDoc,
  updateDoc,
  writeBatch
} from 'firebase/firestore';
import type { UserProfile } from '@/types/user'; // Assumes definition provided previously
import { DEFAULT_PW } from '@/constants';
import { getFunctions, httpsCallable } from "firebase/functions";
const functions = getFunctions();

interface UserCreateResponse {
  success: boolean;
  profile: UserProfile;
}

interface UserBatchCreateResponse {
  results: Array<{
    profile: UserProfile;
    status: string;
    error?: string;
  }>;
}

interface UserDeleteResponse {
  success: boolean;
}

export const userService = {
  /**
   * Fetches the user profile document from Firestore for authorization checks
   */
  async fetchUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  },

  /**
   * Fetch user profile list
   */
  async fetchUserProfiles(): Promise<UserProfile[]> {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      return querySnapshot.docs.map(doc => doc.data() as UserProfile);
    } catch (error) {
      console.error("Error fetching user profiles:", error);
      throw error;
    }
  },

  /**
   * Create a new user profile in Firestore
   */
  async createUser(userData: UserProfile): Promise<UserCreateResponse> {
    const adminCreateUser = httpsCallable(functions, 'adminCreateUser');
    const response = await adminCreateUser({ ...userData, password: DEFAULT_PW });
    return response.data as UserCreateResponse;
  },

  /**
   * Batch create user profiles in Firestore
   */
  async batchCreateUserProfiles(userDatas: UserProfile[]): Promise<UserBatchCreateResponse> {
    const adminBatchCreateUser = httpsCallable(functions, 'adminBatchCreateUsers');
    const response = await adminBatchCreateUser({ users: userDatas.map(user => ({ ...user, password: DEFAULT_PW })) });
    return response.data as UserBatchCreateResponse;
  },

  /**
   * Delete a user profile in Firestore
   */
  async deleteUser(targetUid: string): Promise<UserDeleteResponse> {
    const adminDeleteUser = httpsCallable(functions, 'adminDeleteUser');
    const response = await adminDeleteUser({ targetUid });
    return response.data as UserDeleteResponse;
  },

  /**
   * Sets up or updates a user profile document in Firestore
   */
  async setUserProfile(uid: string, profile: Omit<UserProfile, 'uid'>): Promise<void> {
    await setDoc(doc(db, "users", uid), {
      ...profile,
      uid
    }, { merge: true });
  },

  async createUserProfile(uid: string, email: string): Promise<void> {
    await this.setUserProfile(uid, {
      name: "",
      email,
      datalevel: 1,
      userlevel: 1,
      createdAt: new Date()
    });
  },

  /**
   * Updates multiple user profiles in Firestore
   */
  async updateUserProfiles(profiles: UserProfile[]): Promise<void> {
    const batch = writeBatch(db);
    profiles.forEach(profile => {
      let { uid, ...details } = profile;
      batch.set(doc(db, "users", uid), details, { merge: true });
    });
    await batch.commit();
  },

  /**
   * Updates specific fields (like user access level)
   */
  async updateUserLevel(uid: string, newLevel: number): Promise<void> {
    const docRef = doc(db, "users", uid);
    await updateDoc(docRef, { level: newLevel });
  },

  /**
   * Deletes the user profile document from Firestore
   */
  async deleteUserProfile(uid: string): Promise<void> {
    await deleteDoc(doc(db, "users", uid));
  }


};
