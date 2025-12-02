import type { UserProfile } from "../../modelos/user-profile";
import { profileHttp } from "../http/profile-http";

export const profileService = {
  async fetchProfile(id: string): Promise<UserProfile> {
    return profileHttp.getProfile(id);
  },
  async vetProfile(id: string, banned: boolean): Promise<void> {
    return profileHttp.vetProfile(id, banned);
  },
};
