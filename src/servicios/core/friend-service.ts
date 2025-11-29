import type { FriendRequest } from "../../modelos/friend-request";
import type { UserProfile } from "../../modelos/user-profile";
import { friendHttp } from "../http/friend-http";

export const friendService = {
  async search(query: string): Promise<UserProfile[]> {
    try {
      return await friendHttp.search(query);
    } catch (err) {
      console.warn("Friend search fallback", err);
      return [];
    }
  },
  async sendRequest(from: string, to: string): Promise<FriendRequest> {
    try {
      return await friendHttp.sendRequest(from, to);
    } catch (err) {
      console.warn("Send request fallback", err);
      return {
        id: `local-${Date.now()}`,
        fromUserId: from,
        toUserId: to,
        status: "PENDING",
      };
    }
  },
  async respond(requestId: string, status: string): Promise<FriendRequest> {
    try {
      return await friendHttp.respond(requestId, status);
    } catch (err) {
      console.warn("Respond request fallback", err);
      return { id: requestId, fromUserId: "", toUserId: "", status };
    }
  },
  async pending(userId: string): Promise<FriendRequest[]> {
    try {
      return await friendHttp.listPending(userId);
    } catch (err) {
      console.warn("Pending list fallback", err);
      return [];
    }
  },
  async friends(userId: string): Promise<UserProfile[]> {
    try {
      return await friendHttp.listFriends(userId);
    } catch (err) {
      console.warn("Friends list fallback", err);
      return [];
    }
  },
};
