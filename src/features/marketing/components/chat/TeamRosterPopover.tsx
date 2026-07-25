import { X } from 'lucide-react';
import React from 'react';
import { ChatAgentRosterItem } from '@features/marketing/types/chat-mock';
import { TeamRosterPopoverRow } from '@features/marketing/components/chat/TeamRosterPopoverRow';

interface TeamRosterPopoverProps {
  agents: ChatAgentRosterItem[];
  onClose: () => void;
}

export const TeamRosterPopover: React.FC<TeamRosterPopoverProps> = ({ agents, onClose }) => (
  <div className="absolute left-4 top-14 z-10 w-72 rounded-xl border border-base-300 bg-base-200 shadow-xl">
    <div className="flex items-center justify-between px-3 py-2 border-b border-base-300">
      <p className="text-sm font-semibold">Equipo ({agents.length})</p>
      <button onClick={onClose} className="w-6 h-6 flex items-center justify-center rounded hover:bg-base-300">
        <X size={14} />
      </button>
    </div>
    <div className="flex flex-col gap-0.5 p-2 max-h-80 overflow-y-auto">
      {agents.map((agent) => (
        <TeamRosterPopoverRow key={agent.slug} agent={agent} />
      ))}
    </div>
  </div>
);
