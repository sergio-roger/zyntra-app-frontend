import api from '@shared/api/axios';

interface ChatPreviewRequest {
  message: string;
  config: {
    tone: string;
    welcome_message: string;
    system_prompt_extra?: string;
  };
}

export interface ChatbotConfig {
  id: string;
  business_id: string;
  name: string;
  tone: string;
  welcome_message: string;
  locale: string;
  is_active: boolean;
  system_prompt_extra?: string;
  active_channels?: string[];
  theme?: Record<string, unknown>;
  faqs?: Array<{ question: string; answer: string }>;
  created_at?: string;
  updated_at?: string;
}

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
  preview: async (data: ChatPreviewRequest): Promise<{ response: string }> =>
    unwrap(await api.post('/ai/preview', data)),

  getConfig: async (): Promise<ChatbotConfig> =>
    unwrap(await api.get('/chatbot/config')),

  getOrCreateConfig: async (): Promise<ChatbotConfig> =>
    unwrap(await api.post('/chatbot/config/ensure')),

  updateConfig: async (updates: Partial<ChatbotConfig>): Promise<ChatbotConfig> =>
    unwrap(await api.put('/chatbot/config', updates)),

  getConversations: async (): Promise<Conversation[]> =>
    unwrap(await api.get('/chat/conversations')),

  getConversationDetail: async (id: string): Promise<ConversationDetail> =>
    unwrap(await api.get(`/chat/conversations/${id}`)),
};
