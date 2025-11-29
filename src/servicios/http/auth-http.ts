import type { AuthRequest, AuthResponse } from "../../modelos/auth";
import { request } from "./http-client";

export const authHttp = {
  login: (payload: AuthRequest) => request<AuthResponse>("/auth/login", { method: "POST", body: payload }),
  register: (payload: AuthRequest) => request<AuthResponse>("/auth/register", { method: "POST", body: payload }),
  logout: (token: string) =>
    request<void>("/auth/logout", { method: "POST", headers: { Authorization: token }, body: undefined }),
  refresh: (token: string) =>
    request<AuthResponse>("/auth/refresh", { method: "POST", headers: { Authorization: token }, body: undefined }),
};
