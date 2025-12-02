import type { UserProfile } from "../../modelos/user-profile";
import { request } from "./http-client";
import { authStore } from "../../state/auth-store";

export const profileHttp = {
  getProfile: (id: string) =>
    request<UserProfile>(`/profiles/${id}`, {
      headers: { "X-User-Id": authStore.currentUserId },
    }),
  vetProfile: (id: string, banned: boolean) =>
    request<void>(`/profiles/${id}/vet?banned=${banned}`, {
      method: "POST",
      headers: { "X-User-Id": authStore.currentUserId },
    }),
};
