import { MoreHorizontal, Plus } from 'lucide-react';
import React, { useState } from 'react';
import { CHAT_AGENT_ROSTER, CHAT_MESSAGES } from '@features/marketing/constants/chat-mock-data';
import { ChatTeamAvatarStack } from '@features/marketing/components/chat/ChatTeamAvatarStack';
import { TeamRosterPopover } from '@features/marketing/components/chat/TeamRosterPopover';
import { ChatThread } from '@features/marketing/components/chat/ChatThread';
import { ChatComposer } from '@features/marketing/components/chat/ChatComposer';
import { TeamProcessPanel } from '@features/marketing/components/chat/TeamProcessPanel';

const ChatHeaderActions: React.FC = () => (
  <div className="flex items-center gap-2">
    <button className="btn btn-sm rounded-lg border border-base-300 bg-base-200 text-base-content/80 hover:bg-base-300">
      <Plus size={16} /> Nuevo objetivo
    </button>
    <button className="btn btn-sm btn-square rounded-lg border border-base-300 bg-base-200">
      <MoreHorizontal size={16} />
    </button>
  </div>
);

export const AiAgentsChatPage: React.FC = () => {
  const [isTeamPopoverOpen, setIsTeamPopoverOpen] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-full animate-in fade-in duration-500">
      <div className="relative flex-1 min-h-0 flex flex-col bg-base-200 border border-base-300 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between gap-2 p-3 border-b border-base-300">
          <ChatTeamAvatarStack
            agents={CHAT_AGENT_ROSTER}
            onClick={() => setIsTeamPopoverOpen((prev) => !prev)}
          />
          <ChatHeaderActions />
        </div>
        {isTeamPopoverOpen && (
          <TeamRosterPopover agents={CHAT_AGENT_ROSTER} onClose={() => setIsTeamPopoverOpen(false)} />
        )}
        <ChatThread messages={CHAT_MESSAGES} />
        <ChatComposer />
      </div>
      <TeamProcessPanel />
    </div>
  );
};

export default AiAgentsChatPage;
