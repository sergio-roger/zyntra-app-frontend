import React from 'react';
import { ListChecks, Sparkles, X } from 'lucide-react';
import { SystemAgentCatalogItem } from '@features/marketing/types/agents';
import { AgentAvatar } from '@features/marketing/components/AgentAvatar';
import { AgentStatusBadge } from '@features/marketing/components/AgentStatusBadge';
import { AgentStatsRow } from '@features/marketing/components/AgentStatsRow';

interface AgentDetailModalProps {
  agent: SystemAgentCatalogItem;
  primaryLabel: string;
  primaryDisabled: boolean;
  onPrimaryAction: () => void;
  onClose: () => void;
  showStats?: boolean;
}

export const AgentDetailModal: React.FC<AgentDetailModalProps> = ({
  agent,
  primaryLabel,
  primaryDisabled,
  onPrimaryAction,
  onClose,
  showStats = false,
}) => {
  const isActive = agent.status === 'active';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 !mt-0">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-3xl rounded-2xl bg-base-100 border border-base-300 shadow-2xl overflow-hidden grid grid-cols-1 sm:grid-cols-[340px_1fr] max-h-[85vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-black/30 text-white hover:bg-black/50 backdrop-blur-sm transition-colors z-10"
        >
          <X size={18} />
        </button>

        <div className="relative h-56 sm:h-auto">
          <AgentAvatar agent={agent} shape="panel" bleed />

          {agent.category && (
            <span
              className="absolute top-4 left-4 px-2.5 py-1 rounded-full text-xs font-semibold text-white backdrop-blur-sm"
              style={{ backgroundColor: `${agent.category.color ?? '#7c3aed'}cc` }}
            >
              {agent.category.name}
            </span>
          )}

          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent sm:hidden" />
        </div>

        <div className="flex flex-col divide-y divide-base-300 overflow-y-auto">
          <div className="p-6">
            <h3 className="font-bold text-2xl leading-tight">{agent.name}</h3>
            <p className="text-sm font-medium text-secondary mt-0.5">{agent.role}</p>
            <div className="mt-2">
              <AgentStatusBadge isActive={isActive} />
            </div>
            <p className="text-sm text-base-content/70 mt-3 leading-relaxed">
              {agent.description}
            </p>
          </div>

          {agent.personaPrompt && (
            <div className="p-6">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-base-content/50 uppercase mb-1.5">
                <Sparkles size={13} />
                Personalidad
              </p>
              <p className="text-sm text-base-content/70 leading-relaxed">
                {agent.personaPrompt}
              </p>
            </div>
          )}

          {agent.functions.length > 0 && (
            <div className="p-6">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-base-content/50 uppercase mb-2">
                <ListChecks size={13} />
                Funciones
              </p>
              <ul className="space-y-1.5">
                {agent.functions.map((fn) => (
                  <li key={fn} className="flex items-start gap-2 text-sm">
                    <span className="text-secondary mt-1">•</span>
                    {fn}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {showStats && isActive && (
            <div className="p-6">
              <AgentStatsRow agent={agent} />
            </div>
          )}

          <div className="p-6 mt-auto">
            <button
              onClick={onPrimaryAction}
              disabled={primaryDisabled}
              className="btn btn-sm w-full rounded-lg border-none bg-gradient-to-r from-secondary/20 to-secondary-deep/60 text-white hover:from-secondary/35 hover:to-secondary-deep/80 disabled:opacity-50"
            >
              {primaryLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
