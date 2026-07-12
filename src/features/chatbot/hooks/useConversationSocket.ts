import { useCallback, useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getChatSocket } from '../lib/chatSocket';
import { playNewMessageSound } from '@features/chatbot/lib/notificationSound';
import { ConversationDetail } from '../types/chatbot.types';

const TYPING_STOP_DELAY_MS = 2000;

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

interface TypingPayload {
  conversation_id: string;
  from: 'visitor' | 'agent';
  isTyping: boolean;
}

/** Mantiene la conversación activa al día en vivo vía el gateway /chat. */
export const useConversationSocket = (
  conversationId: string | null,
  soundEnabled = true,
) => {
  const qc = useQueryClient();
  const joinedRef = useRef<string | null>(null);
  const soundEnabledRef = useRef(soundEnabled);
  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);
  const [isVisitorTyping, setIsVisitorTyping] = useState(false);
  const typingSentRef = useRef(false);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const socket = getChatSocket();

    const handleNewMessage = (payload: NewMessagePayload) => {
      if (payload.role !== 'agent' && soundEnabledRef.current) {
        playNewMessageSound();
      }
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

    const handleTyping = (payload: TypingPayload) => {
      if (payload.from !== 'visitor') return;
      setIsVisitorTyping(payload.isTyping);
    };

    socket.on('conversation:new-message', handleNewMessage);
    socket.on('conversation:status-changed', handleStatusChanged);
    socket.on('conversation:typing', handleTyping);

    return () => {
      socket.off('conversation:new-message', handleNewMessage);
      socket.off('conversation:status-changed', handleStatusChanged);
      socket.off('conversation:typing', handleTyping);
    };
  }, [qc]);

  // Switching conversations invalidates any typing signal from the previous one.
  useEffect(() => {
    setIsVisitorTyping(false);
  }, [conversationId]);

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
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
        typingTimerRef.current = null;
      }
      typingSentRef.current = false;
      if (joinedRef.current === conversationId) {
        socket.emit('conversation:leave', { conversationId });
        joinedRef.current = null;
      }
    };
  }, [conversationId]);

  const stopTyping = useCallback(() => {
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
      typingTimerRef.current = null;
    }
    if (typingSentRef.current && conversationId) {
      typingSentRef.current = false;
      getChatSocket().emit('conversation:typing', { conversationId, isTyping: false });
    }
  }, [conversationId]);

  const notifyTyping = useCallback(() => {
    if (!conversationId) return;
    const socket = getChatSocket();

    if (!typingSentRef.current) {
      typingSentRef.current = true;
      socket.emit('conversation:typing', { conversationId, isTyping: true });
    }

    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(stopTyping, TYPING_STOP_DELAY_MS);
  }, [conversationId, stopTyping]);

  return { isVisitorTyping, notifyTyping, stopTyping };
};
