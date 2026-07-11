import { useMutation, useQueryClient } from '@tanstack/react-query';
import { aiApi } from '../api/aiApi';

export const useAssignConversation = () => {
  const qc = useQueryClient();

  const invalidate = () =>
    qc.invalidateQueries({ queryKey: ['conversations'] });

  const assign = useMutation({
    mutationFn: (conversationId: string) =>
      aiApi.assignConversation(conversationId),
    onSuccess: invalidate,
  });

  const unassign = useMutation({
    mutationFn: (conversationId: string) =>
      aiApi.unassignConversation(conversationId),
    onSuccess: invalidate,
  });

  return { assign, unassign };
};
