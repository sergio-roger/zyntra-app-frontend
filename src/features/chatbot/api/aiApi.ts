import api from '@shared/api/axios';
import { ApiResponse, unwrap } from '@core/types/api';
import {
  Conversation,
  ConversationDetail,
} from '@features/chatbot/types/chatbot.types';

export interface ConversationFilters {
  channelId?: string;
  status?: string;
}

export interface SendAgentMessageResponse {
  id: string;
  createdAt: string;
}

export interface ChatbotChannel {
  id: string;
  name: string;
  channelType: { key: string; label: string };
}

export const aiApi = {
  getConversations: (filters: ConversationFilters = {}): Promise<Conversation[]> =>
    api
      .get<unknown, ApiResponse<Conversation[]>>('/chat/conversations', {
        params: filters,
      })
      .then(unwrap),

  getConversationDetail: (id: string): Promise<ConversationDetail> =>
    api
      .get<unknown, ApiResponse<ConversationDetail>>(
        `/chat/conversations/${id}`,
      )
      .then(unwrap),

  // Backend endpoint pendiente (próximo prompt): POST /chat/conversations/:id/messages
  sendAgentMessage: (
    conversationId: string,
    content: string,
  ): Promise<SendAgentMessageResponse> =>
    api
      .post<unknown, ApiResponse<SendAgentMessageResponse>>(
        `/chat/conversations/${conversationId}/messages`,
        { content },
      )
      .then(unwrap),

  // No existe GET /channels plano — el endpoint real está scoped por
  // business (ChannelsController.findAll: GET /businesses/:businessId/channels).
  getChannels: (businessId: string): Promise<ChatbotChannel[]> =>
    api
      .get<unknown, ApiResponse<ChatbotChannel[]>>(
        `/businesses/${businessId}/channels`,
      )
      .then(unwrap),
};
