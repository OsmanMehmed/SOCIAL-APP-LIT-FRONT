import type { UserProfile } from "../../modelos/user-profile";
import { request } from "./http-client";

export const profileHttp = {
  getProfile: (id: string) => request<UserProfile>(`/profiles/${id}`),
  vetProfile: (id: string, banned: boolean) => request<void>(`/profiles/${id}/vet?banned=${banned}`, { method: "POST" }),
};
