import { Bot, User } from 'lucide-react';
import React from 'react';
import { ChatMessage } from '@features/marketing/types/chat-mock';
import { ActionPlanCard } from '@features/marketing/components/chat/ActionPlanCard';
import { DeliverablesList } from '@features/marketing/components/chat/DeliverablesList';
import { MetricsGrid } from '@features/marketing/components/chat/MetricsGrid';

interface ChatMessageBubbleProps {
  message: ChatMessage;
}

export const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({ message }) => (
  <div className="flex gap-3">
    <div
      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
        message.isFromUser ? 'bg-base-300' : 'bg-secondary/20 text-secondary'
      }`}
    >
      {message.isFromUser ? <User size={18} /> : <Bot size={18} />}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-baseline gap-2">
        <p className={`text-sm font-semibold ${message.isFromUser ? '' : 'text-secondary'}`}>
          {message.authorDisplayName}
        </p>
        <span className="text-xs text-base-content/40">{message.time}</span>
      </div>
      <p className="text-sm text-base-content/80 mt-1">{message.text}</p>
      {message.actionPlan && (
        <div className="mt-3">
          <ActionPlanCard steps={message.actionPlan.steps} />
        </div>
      )}
      {message.deliverables && (
        <div className="mt-3">
          <DeliverablesList deliverables={message.deliverables} />
        </div>
      )}
      {message.metrics && (
        <div className="mt-3">
          <MetricsGrid metrics={message.metrics} />
        </div>
      )}
    </div>
  </div>
);
