import type { AuthRequest, AuthResponse } from "../../modelos/auth";
import { authHttp } from "../http/auth-http";
import { CONSTANTS } from "../../shared/constants";

function sanitizeUsername(username: string) {
  return username.replace(/^@+/, "").trim();
}

function normalizeAuthResponse(
  raw: Partial<AuthResponse> | undefined,
  expectedUsername: string,
): AuthResponse {
  if (!raw || !raw.token) {
    throw new Error("Credenciales invalidas.");
  }

  const profile = (raw as any).profile ?? (raw as any).userProfile;
  const normalizedProfileUser = profile?.username
    ? sanitizeUsername(profile.username)
    : "";

  if (
    !profile ||
    !profile.id ||
    normalizedProfileUser.toLowerCase() !== expectedUsername.toLowerCase() ||
    profile.id === "dato-mockeado" ||
    String(raw.token).includes("mock")
  ) {
    throw new Error("Credenciales invalidas.");
  }

  return { token: raw.token as string, profile };
}

export const authService = {
  async login(payload: AuthRequest): Promise<AuthResponse> {
    const username = sanitizeUsername(payload.username ?? "");
    const password = payload.password?.trim() ?? "";

    if (!username || !password) {
      throw new Error("Usuario y contrasena requeridos.");
    }

    try {
      const auth = await authHttp.login({ username, password });
      return normalizeAuthResponse(auth, username);
    } catch (err) {
      const rawMessage = err instanceof Error ? err.message : "";
      const friendly =
        /401|403/.test(rawMessage) || !rawMessage
          ? "Credenciales invalidas."
          : rawMessage;
      throw new Error(friendly);
    }
  },
  async register(payload: AuthRequest): Promise<AuthResponse> {
    try {
      const username = sanitizeUsername(payload.username ?? "");
      const auth = await authHttp.register({ ...payload, username });
      return normalizeAuthResponse(auth, username);
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
      const auth = await authHttp.refresh(token);
      return normalizeAuthResponse(auth, auth?.profile?.username ?? "");
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
