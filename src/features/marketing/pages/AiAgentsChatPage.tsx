import { ChevronDown, MoreHorizontal, Plus } from 'lucide-react';
import React, { useState } from 'react';
import { PageHeader } from '@shared/components/PageHeader';
import { CHAT_AGENT_ROSTER, CHAT_MESSAGES } from '@features/marketing/constants/chat-mock-data';
import { ChatTeamAvatarStack } from '@features/marketing/components/chat/ChatTeamAvatarStack';
import { TeamRosterPopover } from '@features/marketing/components/chat/TeamRosterPopover';
import { ChatThread } from '@features/marketing/components/chat/ChatThread';
import { ChatComposer } from '@features/marketing/components/chat/ChatComposer';
import { TeamProcessPanel } from '@features/marketing/components/chat/TeamProcessPanel';

const HeaderActions: React.FC = () => (
  <div className="flex items-center gap-2">
    <button className="btn btn-sm rounded-lg border-none bg-secondary text-white hover:bg-secondary/80">
      <Plus size={16} /> Nuevo objetivo
    </button>
    <button className="btn btn-sm btn-square rounded-lg border border-base-300 bg-base-200">
      <MoreHorizontal size={16} />
    </button>
  </div>
);

const HeaderSubtitle: React.FC = () => (
  <span className="flex items-center gap-1">
    Tu equipo trabaja en conjunto para alcanzar tus objetivos.
    <ChevronDown size={14} />
  </span>
);

export const AiAgentsChatPage: React.FC = () => {
  const [isTeamPopoverOpen, setIsTeamPopoverOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4 h-full animate-in fade-in duration-500">
      <PageHeader
        title="Chat con tu Equipo de Agentes"
        subtitle={<HeaderSubtitle />}
        badge={
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-secondary/15 text-secondary">
            6 agentes activos
          </span>
        }
        actions={<HeaderActions />}
      />
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1 min-h-0 flex flex-col bg-base-200 border border-base-300 rounded-2xl overflow-hidden">
          <div className="p-3 border-b border-base-300">
            <ChatTeamAvatarStack
              agents={CHAT_AGENT_ROSTER}
              onClick={() => setIsTeamPopoverOpen((prev) => !prev)}
            />
          </div>
          {isTeamPopoverOpen && (
            <TeamRosterPopover agents={CHAT_AGENT_ROSTER} onClose={() => setIsTeamPopoverOpen(false)} />
          )}
          <ChatThread messages={CHAT_MESSAGES} />
          <ChatComposer />
        </div>
        <TeamProcessPanel />
      </div>
    </div>
  );
};

export default AiAgentsChatPage;
