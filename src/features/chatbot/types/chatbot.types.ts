export interface ConversationChannel {
  id: string;
  channel_type: string;
  name: string;
  iconUrl?: string;
}

export interface Conversation {
  id: string;
  status: string;
  channel: ConversationChannel;
  startedAt: string;
  lastMessageAt?: string;
  contactName: string;
  assignedTo?: { id: string; name: string } | null;
  unreadCount: number;
}

export interface ConversationDetail extends Conversation {
  visitor?: Record<string, unknown>;
  messages: Array<{
    id: string;
    role: string;
    content: string;
    createdAt: string;
    channel_type?: string;
  }>;
}
