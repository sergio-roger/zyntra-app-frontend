import { Bot, Headset, PenSquare, Search, TrendingUp, Zap } from 'lucide-react';
import React from 'react';
import { ChatAgentRosterItem } from '@features/marketing/types/chat-mock';

const SLUG_ICONS: Record<string, React.ElementType> = {
  'marketing-strategist': TrendingUp,
  'content-creator': PenSquare,
  'seo-specialist': Search,
  'data-analyst': Zap,
  'automation-agent': Bot,
  'crm-agent': Headset,
};

const STATUS_LABEL: Record<ChatAgentRosterItem['status'], string> = {
  active: 'Activo',
  working: 'Trabajando',
  idle: 'Inactivo',
};

const STATUS_DOT_CLASS: Record<ChatAgentRosterItem['status'], string> = {
  active: 'bg-success',
  working: 'bg-warning',
  idle: 'bg-base-content/30',
};

interface ChatAgentRosterCardProps {
  agent: ChatAgentRosterItem;
}

export const ChatAgentRosterCard: React.FC<ChatAgentRosterCardProps> = ({ agent }) => {
  const Icon = SLUG_ICONS[agent.slug] ?? Bot;
  return (
    <div className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-base-200 border border-base-300 min-w-[104px]">
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center"
        style={{ backgroundColor: `${agent.color}26`, color: agent.color }}
      >
        <Icon size={26} strokeWidth={2} />
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold leading-tight">{agent.displayName}</p>
        <p className="text-[11px] text-base-content/50 leading-tight">{agent.role}</p>
      </div>
      <div className="flex items-center gap-1.5">
        <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT_CLASS[agent.status]}`} />
        <span className="text-[11px] text-base-content/60">{STATUS_LABEL[agent.status]}</span>
      </div>
    </div>
  );
};
