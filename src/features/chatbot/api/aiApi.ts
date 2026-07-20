import api from '@shared/api/axios';
import { ApiResponse, unwrap } from '@core/types/api';
import {
  Conversation,
  ConversationDetail,
} from '@features/chatbot/types/chatbot.types';

export interface ConversationFilters {
  channelId?: string;
  status?: string;
  assignedToMe?: boolean;
  unread?: boolean;
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

export interface AssignableUser {
  id: string;
  name: string;
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

  // Token corto para autenticar la conexión WebSocket del agente (el panel
  // usa cookie httpOnly, ilegible por JS; ChatGateway solo acepta bearer).
  getSocketToken: (): Promise<{ token: string }> =>
    api
      .post<unknown, ApiResponse<{ token: string }>>('/chat/socket-token')
      .then(unwrap),

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

  assignConversation: (
    conversationId: string,
    userId?: string,
  ): Promise<{ success: boolean; assignedTo: { id: string; name: string } }> =>
    api
      .post<
        unknown,
        ApiResponse<{ success: boolean; assignedTo: { id: string; name: string } }>
      >(
        `/chat/conversations/${conversationId}/assign`,
        userId ? { userId } : undefined,
      )
      .then(unwrap),

  getAssignableUsers: (): Promise<AssignableUser[]> =>
    api
      .get<unknown, ApiResponse<AssignableUser[]>>('/chat/assignable-users')
      .then(unwrap),

  unassignConversation: (conversationId: string): Promise<{ success: boolean }> =>
    api
      .delete<unknown, ApiResponse<{ success: boolean }>>(
        `/chat/conversations/${conversationId}/assign`,
      )
      .then(unwrap),

  markConversationAsRead: (
    conversationId: string,
  ): Promise<{ success: boolean }> =>
    api
      .patch<unknown, ApiResponse<{ success: boolean }>>(
        `/chat/conversations/${conversationId}/read`,
      )
      .then(unwrap),

  updateConversationStatus: (
    conversationId: string,
    status: string,
  ): Promise<{ success: boolean; status: string }> =>
    api
      .patch<unknown, ApiResponse<{ success: boolean; status: string }>>(
        `/chat/conversations/${conversationId}/status`,
        { status },
      )
      .then(unwrap),
};
