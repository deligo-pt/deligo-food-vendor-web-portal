export type TConversationStatus = "OPEN" | "IN_PROGRESS" | "CLOSED";

export type TMessage = {
  _id: string;
  room: string;
  senderId: string;
  senderRole: string;
  message: string;
  attachments: string[];
  readBy: Record<string, boolean>;
  createdAt: string;
};

export type TConversation = {
  room: string;
  participants: {
    userId: string;
    role: string;
    name: string;
  }[];
  handledBy: string | null;
  status: TConversationStatus;
  unreadCount: Record<string, number>;
  lastMessage: string;
  lastMessageTime: string;
};
