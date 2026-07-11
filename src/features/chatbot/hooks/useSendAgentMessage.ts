import { useMutation, useQueryClient } from '@tanstack/react-query';
import { aiApi } from '../api/aiApi';
import { ConversationDetail } from '../types/chatbot.types';

interface SendAgentMessageVars {
  conversationId: string;
  content: string;
}

interface MutationContext {
  previous?: ConversationDetail;
  optimisticId: string;
  conversationId: string;
}

export const useSendAgentMessage = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ conversationId, content }: SendAgentMessageVars) =>
      aiApi.sendAgentMessage(conversationId, content),

    onMutate: async ({
      conversationId,
      content,
    }): Promise<MutationContext> => {
      const key = ['conversations', 'detail', conversationId];
      await qc.cancelQueries({ queryKey: key });

      const previous = qc.getQueryData<ConversationDetail>(key);
      const optimisticId = `optimistic-${conversationId}-${previous?.messages.length ?? 0}`;

      if (previous) {
        qc.setQueryData<ConversationDetail>(key, {
          ...previous,
          messages: [
            ...previous.messages,
            {
              id: optimisticId,
              role: 'assistant',
              content,
              createdAt: new Date().toISOString(),
            },
          ],
        });
      }

      return { previous, optimisticId, conversationId };
    },

    onError: (_err, _vars, context) => {
      if (!context?.previous) return;
      qc.setQueryData(
        ['conversations', 'detail', context.conversationId],
        context.previous,
      );
    },

    onSuccess: (data, _vars, context) => {
      if (!context) return;
      const key = ['conversations', 'detail', context.conversationId];
      qc.setQueryData<ConversationDetail>(key, (current) => {
        if (!current) return current;
        return {
          ...current,
          messages: current.messages.map((m) =>
            m.id === context.optimisticId
              ? { ...m, id: data.id, createdAt: data.createdAt }
              : m,
          ),
        };
      });
    },
  });
};
