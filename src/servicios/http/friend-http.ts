import type { FriendRequest } from "../../modelos/friend-request";
import type { UserProfile } from "../../modelos/user-profile";
import { request } from "./http-client";

export const friendHttp = {
  search: (q: string) => request<UserProfile[]>(`/friends/search?q=${encodeURIComponent(q)}`),
  sendRequest: (from: string, to: string) => request<FriendRequest>(`/friends/requests?from=${from}&to=${to}`, { method: "POST" }),
  respond: (id: string, status: string) => request<FriendRequest>(`/friends/requests/${id}/respond?status=${status}`, { method: "POST" }),
  listPending: (userId: string) => request<FriendRequest[]>(`/friends/requests?userId=${userId}`),
  listFriends: (userId: string) => request<UserProfile[]>(`/friends?userId=${userId}`),
};
