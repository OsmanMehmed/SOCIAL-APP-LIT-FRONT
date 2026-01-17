import type { AuthRequest, AuthResponse } from "../../modelos/auth";
import { authHttp } from "../http/auth-http";

export const authService = {
  login(payload: AuthRequest): Promise<AuthResponse> {
    return authHttp.login(payload);
  },
  register(payload: AuthRequest): Promise<AuthResponse> {
    return authHttp.register(payload);
  },
  logout(token: string): Promise<void> {
    return authHttp.logout(token);
  },
  refresh(token: string): Promise<AuthResponse> {
    return authHttp.refresh(token);
  },
};
