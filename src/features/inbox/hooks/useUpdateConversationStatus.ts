import { useMutation, useQueryClient } from '@tanstack/react-query';
import { aiApi } from '../api/aiApi';
import { ConversationDetail } from '../types/inbox.types';

export const useUpdateConversationStatus = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      conversationId,
      status,
    }: {
      conversationId: string;
      status: string;
    }) => aiApi.updateConversationStatus(conversationId, status),
    onSuccess: (_data, { conversationId, status }) => {
      const key = ['conversations', 'detail', conversationId];
      qc.setQueryData<ConversationDetail>(key, (current) =>
        current ? { ...current, status } : current,
      );
      qc.invalidateQueries({ queryKey: ['conversations'], exact: false });
    },
  });
};
