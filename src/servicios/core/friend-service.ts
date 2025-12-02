import type { FriendRequest } from "../../modelos/friend-request";
import type { UserProfile } from "../../modelos/user-profile";
import { friendHttp } from "../http/friend-http";

export const friendService = {
  async search(query: string): Promise<UserProfile[]> {
    return friendHttp.search(query);
  },
  async sendRequest(from: string, to: string): Promise<FriendRequest> {
    return friendHttp.sendRequest(from, to);
  },
  async respond(requestId: string, status: string): Promise<FriendRequest> {
    return friendHttp.respond(requestId, status);
  },
  async pending(userId: string): Promise<FriendRequest[]> {
    return friendHttp.listPending(userId);
  },
  async friends(userId: string): Promise<UserProfile[]> {
    return friendHttp.listFriends(userId);
  },
};
