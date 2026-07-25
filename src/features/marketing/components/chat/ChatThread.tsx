import React from 'react';
import { ChatMessage } from '@features/marketing/types/chat-mock';
import { ChatMessageBubble } from '@features/marketing/components/chat/ChatMessageBubble';

interface ChatThreadProps {
  messages: ChatMessage[];
}

export const ChatThread: React.FC<ChatThreadProps> = ({ messages }) => (
  <div className="flex-1 overflow-y-auto flex flex-col gap-5 p-5">
    {messages.map((message) => (
      <ChatMessageBubble key={message.id} message={message} />
    ))}
  </div>
);
