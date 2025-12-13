import type { UserProfile } from "../../modelos/user-profile";
import { profileHttp } from "../http/profile-http";

export const profileService = {
  async fetchProfile(id: string): Promise<UserProfile> {
    return profileHttp.getProfile(id);
  },
  async updateProfile(
    id: string,
    profile: Partial<UserProfile>
  ): Promise<UserProfile> {
    return profileHttp.updateProfile(id, profile);
  },
  async vetProfile(id: string, banned: boolean): Promise<void> {
    return profileHttp.vetProfile(id, banned);
  },
  async uploadAvatar(id: string, file: File): Promise<UserProfile> {
    return profileHttp.uploadAvatar(id, file);
  },
};
