import { Bot, Headset, PenSquare, Search, TrendingUp, Zap } from 'lucide-react';
import { ChatAgentRosterItem } from '@features/marketing/types/chat-mock';

export const CHAT_AGENT_SLUG_ICONS: Record<string, React.ElementType> = {
  'marketing-strategist': TrendingUp,
  'content-creator': PenSquare,
  'seo-specialist': Search,
  'data-analyst': Zap,
  'automation-agent': Bot,
  'crm-agent': Headset,
};

export const CHAT_AGENT_STATUS_LABEL: Record<ChatAgentRosterItem['status'], string> = {
  active: 'Activo',
  working: 'Trabajando',
  idle: 'Inactivo',
};

export const CHAT_AGENT_STATUS_DOT_CLASS: Record<ChatAgentRosterItem['status'], string> = {
  active: 'bg-success',
  working: 'bg-warning',
  idle: 'bg-base-content/30',
};
