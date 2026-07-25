import React from 'react';
import { SystemAgentCatalogItem } from '@features/marketing/types/agents';
import { AgentAvatar } from '@features/marketing/components/AgentAvatar';
import { AgentStatusBadge } from '@features/marketing/components/AgentStatusBadge';
import { AgentStatsRow } from '@features/marketing/components/AgentStatsRow';

interface AgentCardProps {
  agent: SystemAgentCatalogItem;
  primaryLabel: string;
  primaryDisabled: boolean;
  onPrimaryAction: () => void;
  onShowDetail: () => void;
  showStats?: boolean;
}

export const AgentCard: React.FC<AgentCardProps> = ({
  agent,
  primaryLabel,
  primaryDisabled,
  onPrimaryAction,
  onShowDetail,
  showStats = false,
}) => {
  const isActive = agent.status === 'active';
  return (
    <div
      className="group flex flex-col gap-3 p-5 rounded-2xl bg-base-200 border border-base-300
        transition-colors hover:border-base-content/20"
    >
      <AgentAvatar agent={agent} />
      <div>
        <h3 className="font-bold text-lg leading-tight">{agent.name}</h3>
        <p className="text-xs font-medium text-secondary">{agent.role}</p>
      </div>
      <p className="text-sm text-base-content/60 flex-1">{agent.description}</p>
      <AgentStatusBadge isActive={isActive} />
      {showStats && isActive && <AgentStatsRow agent={agent} />}
      <div className="flex gap-2 mt-2">
        <button
          onClick={onShowDetail}
          className="btn btn-sm rounded-lg border border-base-300 bg-base-100 hover:bg-base-300"
        >
          Detalle
        </button>
        <button
          onClick={onPrimaryAction}
          disabled={primaryDisabled}
          className="btn btn-sm flex-1 h-auto min-h-0 py-2 rounded-lg border-none bg-tertiary text-tertiary-content text-xs leading-tight whitespace-normal hover:opacity-90 disabled:opacity-50"
        >
          {primaryLabel}
        </button>
      </div>
    </div>
  );
};
