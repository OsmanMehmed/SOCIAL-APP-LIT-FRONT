import type { UserProfile } from "../../modelos/user-profile";
import { profileHttp } from "../http/profile-http";
import { CONSTANTS } from "../../shared/constants";

const buildFallbackProfile = (id: string): UserProfile => ({
  id,
  username: id.startsWith(CONSTANTS.USERNAME_PREFIX)
    ? id
    : `${CONSTANTS.USERNAME_PREFIX}${id}`,
  subtitle: CONSTANTS.MINI_PROFILE_SUBTITLE_DEFAULT,
  friend: id === "ana.cocina",
  banned: false,
  avatarUrl: null,
});

export const profileService = {
  async fetchProfile(id: string): Promise<UserProfile> {
    try {
      return await profileHttp.getProfile(id);
    } catch (err) {
      console.warn("Profile fetch fallback", err);
      return buildFallbackProfile(id);
    }
  },
  async vetProfile(id: string, banned: boolean): Promise<boolean> {
    try {
      await profileHttp.vetProfile(id, banned);
    } catch (err) {
      console.warn("Vet profile fallback", err);
    }
    return banned;
  },
};
