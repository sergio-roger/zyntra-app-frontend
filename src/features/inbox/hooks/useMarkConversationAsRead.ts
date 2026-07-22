import { useMutation, useQueryClient } from '@tanstack/react-query';
import { aiApi } from '../api/aiApi';

export const useMarkConversationAsRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (conversationId: string) =>
      aiApi.markConversationAsRead(conversationId),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['conversations'], exact: false }),
  });
};
