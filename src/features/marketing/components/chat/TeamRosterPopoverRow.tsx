import { Bot } from 'lucide-react';
import React from 'react';
import { ChatAgentRosterItem } from '@features/marketing/types/chat-mock';
import {
  CHAT_AGENT_SLUG_ICONS,
  CHAT_AGENT_STATUS_DOT_CLASS,
  CHAT_AGENT_STATUS_LABEL,
} from '@features/marketing/constants/chat-agent-visuals';

interface TeamRosterPopoverRowProps {
  agent: ChatAgentRosterItem;
}

export const TeamRosterPopoverRow: React.FC<TeamRosterPopoverRowProps> = ({ agent }) => {
  const Icon = CHAT_AGENT_SLUG_ICONS[agent.slug] ?? Bot;
  return (
    <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-base-300/50">
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${agent.color}26`, color: agent.color }}
      >
        <Icon size={16} strokeWidth={2} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium leading-tight truncate">{agent.displayName}</p>
        <p className="text-[11px] text-base-content/50 leading-tight truncate">{agent.role}</p>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <span className={`w-1.5 h-1.5 rounded-full ${CHAT_AGENT_STATUS_DOT_CLASS[agent.status]}`} />
        <span className="text-[11px] text-base-content/60">{CHAT_AGENT_STATUS_LABEL[agent.status]}</span>
      </div>
    </div>
  );
};
