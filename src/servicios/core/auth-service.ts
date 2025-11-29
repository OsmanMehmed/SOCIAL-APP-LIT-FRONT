import type { AuthRequest, AuthResponse } from "../../modelos/auth";
import { authHttp } from "../http/auth-http";
import { CONSTANTS } from "../../shared/constants";

export const authService = {
  async login(payload: AuthRequest): Promise<AuthResponse> {
    try {
      return await authHttp.login(payload);
    } catch (err) {
      console.warn("Auth login fallback", err);
      return {
        token: "dev-token",
        profile: {
          id: CONSTANTS.CURRENT_USER_ID,
          username: payload.username,
          subtitle: CONSTANTS.MINI_PROFILE_SUBTITLE_DEFAULT,
          friend: false,
          banned: false,
          avatarUrl: null,
        },
      };
    }
  },
  async register(payload: AuthRequest): Promise<AuthResponse> {
    try {
      return await authHttp.register(payload);
    } catch (err) {
      console.warn("Auth register fallback", err);
      return {
        token: "dev-token-new",
        profile: {
          id: payload.username.replace(CONSTANTS.USERNAME_PREFIX, ""),
          username: payload.username,
          subtitle: CONSTANTS.MINI_PROFILE_SUBTITLE_DEFAULT,
          friend: false,
          banned: false,
          avatarUrl: null,
        },
      };
    }
  },
  async logout(token: string): Promise<void> {
    try {
      await authHttp.logout(token);
    } catch (err) {
      console.warn("Auth logout fallback", err);
    }
  },
  async refresh(token: string): Promise<AuthResponse> {
    try {
      return await authHttp.refresh(token);
    } catch (err) {
      console.warn("Auth refresh fallback", err);
      return {
        token,
        profile: {
          id: CONSTANTS.CURRENT_USER_ID,
          username: `${CONSTANTS.USERNAME_PREFIX}${CONSTANTS.CURRENT_USER_ID}`,
          subtitle: CONSTANTS.MINI_PROFILE_SUBTITLE_DEFAULT,
          friend: false,
          banned: false,
          avatarUrl: null,
        },
      };
    }
  },
};
