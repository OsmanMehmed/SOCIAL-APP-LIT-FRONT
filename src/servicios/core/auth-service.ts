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
          id: "dato-mockeado",
          username: `${payload.username}-dato-mockeado`,
          subtitle: "dato-mockeado",
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
          id: "dato-mockeado",
          username: `${payload.username}-dato-mockeado`,
          subtitle: "dato-mockeado",
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
        token: "token-dato-mockeado",
        profile: {
          id: "dato-mockeado",
          username: `${CONSTANTS.USERNAME_PREFIX}${CONSTANTS.CURRENT_USER_ID}-dato-mockeado`,
          subtitle: "dato-mockeado",
          friend: false,
          banned: false,
          avatarUrl: null,
        },
      };
    }
  },
};
