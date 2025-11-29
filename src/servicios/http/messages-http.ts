import type { Conversation } from "../../modelos/conversation";
import type { DirectMessage } from "../../modelos/direct-message";
import { request } from "./http-client";

export const conversationsHttp = {
  list: (userId: string) => request<Conversation[]>(`/messages/conversations?userId=${userId}`),
  create: (a: string, b: string) => request<Conversation>(`/messages/conversations?a=${a}&b=${b}`, { method: "POST" }),
};

export const messagesHttp = {
  getThread: (conversationId: string) => request<DirectMessage[]>(`/messages/thread/${conversationId}`),
  sendMessage: (conversationId: string, payload: { fromUserId: string; toUserId: string; text: string }) =>
    request<DirectMessage>(`/messages/thread/${conversationId}`, { method: "POST", body: payload }),
  deleteMessage: (messageId: string) => request<void>(`/messages/messages/${messageId}`, { method: "DELETE" }),
};
