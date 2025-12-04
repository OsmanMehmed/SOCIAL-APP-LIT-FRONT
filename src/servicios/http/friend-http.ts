import type { FriendRequest } from "../../modelos/friend-request";
import type { Friendship } from "../../modelos/friendship";
import type { UserProfile } from "../../modelos/user-profile";
import { request } from "./http-client";
import { authStore } from "../../state/auth-store";

export const friendHttp = {
  search: (q: string) =>
    request<UserProfile[]>(`/friends/search?q=${encodeURIComponent(q)}`),
  sendRequest: (from: string, to: string) =>
    request<FriendRequest>(`/friends/requests?from=${from}&to=${to}`, {
      method: "POST",
      headers: { "X-User-Id": authStore.currentUserId },
    }),
  respond: (id: string, status: string) =>
    request<FriendRequest>(`/friends/requests/${id}/respond?status=${status}`, {
      method: "POST",
      headers: { "X-User-Id": authStore.currentUserId },
    }),
  listPending: (userId: string) =>
    request<FriendRequest[]>(`/friends/requests?userId=${userId}`),
  listFriends: (userId: string) =>
    request<UserProfile[]>(`/friends?userId=${userId}`),
  connect: (friendId: string) =>
    request<Friendship>(`/friends?friendId=${friendId}`, {
      method: "POST",
      headers: { "X-User-Id": authStore.currentUserId },
    }),
  disconnect: (friendId: string) =>
    request<void>(`/friends?friendId=${friendId}`, {
      method: "DELETE",
      headers: { "X-User-Id": authStore.currentUserId },
    }),
  status: (friendId: string) =>
    request<boolean>(`/friends/status?friendId=${friendId}`, {
      headers: { "X-User-Id": authStore.currentUserId },
    }),
};
