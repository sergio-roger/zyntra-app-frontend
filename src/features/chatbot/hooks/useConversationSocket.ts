import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getChatSocket } from '../lib/chatSocket';
import { ConversationDetail } from '../types/chatbot.types';

interface NewMessagePayload {
  conversation_id: string;
  message: string;
  role: 'user' | 'assistant' | 'agent';
  timestamp: string;
}

interface StatusChangedPayload {
  conversation_id: string;
  status: string;
  timestamp: string;
}

/** Mantiene la conversación activa al día en vivo vía el gateway /chat. */
export const useConversationSocket = (conversationId: string | null) => {
  const qc = useQueryClient();
  const joinedRef = useRef<string | null>(null);

  useEffect(() => {
    const socket = getChatSocket();

    const handleNewMessage = (payload: NewMessagePayload) => {
      const key = ['conversations', 'detail', payload.conversation_id];
      qc.setQueryData<ConversationDetail>(key, (current) => {
        if (!current) return current;
        const last = current.messages[current.messages.length - 1];
        if (last && last.role === payload.role && last.content === payload.message) {
          return current;
        }
        return {
          ...current,
          messages: [
            ...current.messages,
            {
              id: `live-${payload.timestamp}`,
              role: payload.role,
              content: payload.message,
              createdAt: payload.timestamp,
            },
          ],
        };
      });
      qc.invalidateQueries({ queryKey: ['conversations'], exact: false });
    };

    const handleStatusChanged = (payload: StatusChangedPayload) => {
      const key = ['conversations', 'detail', payload.conversation_id];
      qc.setQueryData<ConversationDetail>(key, (current) =>
        current ? { ...current, status: payload.status } : current,
      );
      qc.invalidateQueries({ queryKey: ['conversations'], exact: false });
    };

    socket.on('conversation:new-message', handleNewMessage);
    socket.on('conversation:status-changed', handleStatusChanged);

    return () => {
      socket.off('conversation:new-message', handleNewMessage);
      socket.off('conversation:status-changed', handleStatusChanged);
    };
  }, [qc]);

  useEffect(() => {
    if (!conversationId) return;
    const socket = getChatSocket();

    const join = () => {
      socket.emit('conversation:join', { conversationId });
      joinedRef.current = conversationId;
    };

    if (socket.connected) join();
    socket.on('connect', join);

    return () => {
      socket.off('connect', join);
      if (joinedRef.current === conversationId) {
        socket.emit('conversation:leave', { conversationId });
        joinedRef.current = null;
      }
    };
  }, [conversationId]);
};
