export interface DirectMessage {
  id: string;
  conversationId: string;
  fromUserId: string;
  toUserId: string;
  text: string;
  sentAt: string;
}
