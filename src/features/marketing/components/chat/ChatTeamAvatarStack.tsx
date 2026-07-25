import { Bot } from 'lucide-react';
import React from 'react';
import { ChatAgentRosterItem } from '@features/marketing/types/chat-mock';
import { CHAT_AGENT_SLUG_ICONS } from '@features/marketing/constants/chat-agent-visuals';

const MAX_VISIBLE_AVATARS = 5;

interface ChatTeamAvatarStackProps {
  agents: ChatAgentRosterItem[];
  onClick: () => void;
}

export const ChatTeamAvatarStack: React.FC<ChatTeamAvatarStackProps> = ({ agents, onClick }) => {
  const visibleAgents = agents.slice(0, MAX_VISIBLE_AVATARS);
  const hiddenCount = agents.length - visibleAgents.length;

  return (
    <button onClick={onClick} className="flex items-center gap-2 group">
      <div className="flex -space-x-2">
        {visibleAgents.map((agent) => {
          const Icon = CHAT_AGENT_SLUG_ICONS[agent.slug] ?? Bot;
          return (
            <div
              key={agent.slug}
              title={agent.displayName}
              className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-base-200"
              style={{ backgroundColor: `${agent.color}33`, color: agent.color }}
            >
              <Icon size={14} strokeWidth={2} />
            </div>
          );
        })}
        {hiddenCount > 0 && (
          <div className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-base-200 bg-base-300 text-[11px] font-semibold text-base-content/70">
            +{hiddenCount}
          </div>
        )}
      </div>
      <span className="text-sm text-base-content/60 group-hover:text-base-content/90">Ver equipo</span>
    </button>
  );
};
