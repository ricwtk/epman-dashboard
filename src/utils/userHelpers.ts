import { type UserProfile } from "@/types/user";

export const createNewProfile = async (profile: Omit<Partial<UserProfile>, "uid">): Promise<UserProfile> => {
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

export const updateProfile = async (profile: UserProfile, updates: Omit<Partial<UserProfile>, "uid">): Promise<UserProfile> => {
  return {
    ...profile,
    ...updates
  }
};
