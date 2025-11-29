import type { Conversation } from "../../modelos/conversation";
import type { DirectMessage } from "../../modelos/direct-message";
import { conversationsHttp, messagesHttp } from "../http/messages-http";

const fallbackConversation = (userId: string): Conversation => ({
  id: "conv-local",
  participantA: userId,
  participantB: "ana.cocina-dato-mockeado",
  updatedAt: new Date().toISOString(),
});

export const messageService = {
  async listConversations(userId: string): Promise<Conversation[]> {
    try {
      return await conversationsHttp.list(userId);
    } catch (err) {
      console.warn("List conversations fallback", err);
      return [fallbackConversation(userId)];
    }
  },

  async createConversation(a: string, b: string): Promise<Conversation> {
    try {
      return await conversationsHttp.create(a, b);
    } catch (err) {
      console.warn("Create conversation fallback", err);
      return fallbackConversation(a);
    }
  },

  async fetchThread(conversationId: string): Promise<DirectMessage[]> {
    try {
      return await messagesHttp.getThread(conversationId);
    } catch (err) {
      console.warn("Thread fetch fallback", err);
      return [
        {
          id: "m1",
          conversationId,
          fromUserId: "ana.cocina-dato-mockeado",
          toUserId: "me",
          text: "dato-mockeado: Tip anterior sobre la receta.",
          sentAt: new Date().toISOString(),
        },
      ];
    }
  },

  async sendMessage(
    conversationId: string,
    fromUserId: string,
    toUserId: string,
    text: string
  ): Promise<DirectMessage> {
    try {
      return await messagesHttp.sendMessage(conversationId, { fromUserId, toUserId, text });
    } catch (err) {
      console.warn("Send message fallback", err);
      return {
        id: `local-${Date.now()}`,
        conversationId,
        fromUserId,
        toUserId,
        text,
        sentAt: new Date().toISOString(),
      };
    }
  },

  async deleteMessage(messageId: string): Promise<void> {
    try {
      await messagesHttp.deleteMessage(messageId);
    } catch (err) {
      console.warn("Delete message fallback", err);
    }
  },
};
