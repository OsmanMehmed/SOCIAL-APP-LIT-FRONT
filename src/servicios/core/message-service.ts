import type { Conversation } from "../../modelos/conversation";
import type { DirectMessage } from "../../modelos/direct-message";
import { conversationsHttp, messagesHttp } from "../http/messages-http";

export const messageService = {
  async listConversations(userId: string): Promise<Conversation[]> {
    return conversationsHttp.list(userId);
  },

  async createConversation(a: string, b: string): Promise<Conversation> {
    return conversationsHttp.create(a, b);
  },

  async fetchThread(conversationId: string): Promise<DirectMessage[]> {
    return messagesHttp.getThread(conversationId);
  },

  async sendMessage(
    conversationId: string,
    fromUserId: string,
    toUserId: string,
    text: string,
  ): Promise<DirectMessage> {
    return messagesHttp.sendMessage(conversationId, {
      fromUserId,
      toUserId,
      text,
    });
  },

  async deleteMessage(messageId: string): Promise<void> {
    return messagesHttp.deleteMessage(messageId);
  },
};
