import api from '@shared/api/axios';
import { ApiResponse, unwrap } from '@core/types/api';
import {
  Conversation,
  ConversationDetail,
} from '@features/chatbot/types/chatbot.types';

export const aiApi = {
  getConversations: (): Promise<Conversation[]> =>
    api
      .get<unknown, ApiResponse<Conversation[]>>('/chat/conversations')
      .then(unwrap),

  getConversationDetail: (id: string): Promise<ConversationDetail> =>
    api
      .get<unknown, ApiResponse<ConversationDetail>>(
        `/chat/conversations/${id}`,
      )
      .then(unwrap),
};
 