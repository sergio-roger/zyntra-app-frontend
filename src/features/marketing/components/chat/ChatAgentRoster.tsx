import React from 'react';
import { ChatAgentRosterItem } from '@features/marketing/types/chat-mock';
import { ChatAgentRosterCard } from '@features/marketing/components/chat/ChatAgentRosterCard';

interface ChatAgentRosterProps {
  agents: ChatAgentRosterItem[];
}

export const ChatAgentRoster: React.FC<ChatAgentRosterProps> = ({ agents }) => (
  <div className="flex gap-3 overflow-x-auto pb-1">
    {agents.map((agent) => (
      <ChatAgentRosterCard key={agent.slug} agent={agent} />
    ))}
  </div>
);
