import api from '@shared/api/axios';

export interface Conversation {
  id: string;
  status: string;
  channel: string;
  started_at: string;
  last_message_at?: string;
  contact_name: string;
}

export interface ConversationDetail extends Conversation {
  visitor?: Record<string, unknown>;
  messages: Array<{
    id: string;
    role: string;
    content: string;
    created_at: string;
  }>;
}

/**
 * Backend wraps every response in { success, message, data }.
 * Axios interceptor returns response.data (the envelope).
 * Helper extracts the inner payload.
 */
const unwrap = <T>(envelope: unknown): T => {
  const e = envelope as { data?: T } | T;
  if (e && typeof e === 'object' && 'data' in (e as object)) {
    return (e as { data: T }).data;
  }
  return e as T;
};

export const aiApi = {
  getConversations: async (): Promise<Conversation[]> =>
    unwrap(await api.get('/chat/conversations')),

  getConversationDetail: async (id: string): Promise<ConversationDetail> =>
    unwrap(await api.get(`/chat/conversations/${id}`)),
};
