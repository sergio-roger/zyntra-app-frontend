export interface Conversation {
  id: string;
  status: string;
  channel: string;
  channelId?: string;
  contactId?: string | null;
  startedAt: string;
  lastMessageAt?: string;
  contactName: string;
  assignedTo?: { id: string; name: string } | null;
  unread?: boolean;
  unreadCount?: number;
  lastMessage?: string | null;
}

export interface ConversationDetail extends Conversation {
  visitor?: Record<string, unknown>;
  messages: Array<{
    id: string;
    role: string;
    content: string;
    createdAt: string;
    isRead?: boolean;
  }>;
}
