import { type UserProfile } from "@/types/user";

export const createNewProfile = (profile?: Omit<Partial<UserProfile>, "uid">): UserProfile => {
  return {
    uid: "",
    name: "",
    email: "",
    datalevel: 1,
    userlevel: 1,
    createdAt: new Date(),
    ...profile
  }
};

export const updateProfile = (profile: UserProfile, updates: Omit<Partial<UserProfile>, "uid">): UserProfile => {
  return {
    ...profile,
    ...updates
  }
};
