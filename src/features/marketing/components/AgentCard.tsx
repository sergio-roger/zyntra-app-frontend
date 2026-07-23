import {
  Bot,
  Megaphone,
  Palette,
  PenSquare,
  Search,
  Share2,
  TrendingUp,
  Users,
} from 'lucide-react';
import React from 'react';
import { SystemAgentCatalogItem } from '../types/agents';

const SLUG_ICONS: Record<string, React.ElementType> = {
  'marketing-strategist': TrendingUp,
  'content-creator': PenSquare,
  'seo-specialist': Search,
  'multimedia-designer': Palette,
  'social-media-manager': Share2,
  'crm-agent': Users,
  'automation-agent': Bot,
  'data-analyst': Megaphone,
};

const IconBadge: React.FC<{ agent: SystemAgentCatalogItem }> = ({ agent }) => {
  const Icon = SLUG_ICONS[agent.slug] ?? Bot;
  const color = agent.category?.color ?? '#7c3aed';
  return (
    <div
      className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-110 group-hover:brightness-125"
      style={{ backgroundColor: `${color}33`, color }}
    >
      <Icon size={24} />
    </div>
  );
};

const StatusBadge: React.FC<{ isActive: boolean }> = ({ isActive }) => (
  <div className="flex items-center gap-1.5">
    <span
      className={`w-2 h-2 rounded-full ${isActive ? 'bg-success' : 'bg-base-content/30'}`}
    />
    <span className="text-xs text-base-content/60">
      {isActive ? 'Activo' : 'Próximamente'}
    </span>
  </div>
);

const StatsRow: React.FC<{ agent: SystemAgentCatalogItem }> = ({ agent }) => (
  <div className="grid grid-cols-2 gap-2 text-sm">
    <div>
      <p className="text-base-content/50">Tareas hoy</p>
      <p className="font-semibold">
        {agent.tasksDoneToday} / {agent.tasksTotalToday}
      </p>
    </div>
    <div>
      <p className="text-base-content/50">Eficiencia</p>
      <p className="font-semibold text-success">{agent.efficiency}%</p>
    </div>
  </div>
);

interface AgentCardProps {
  agent: SystemAgentCatalogItem;
  primaryLabel: string;
  primaryDisabled: boolean;
  onPrimaryAction: () => void;
  showStats?: boolean;
}

export const AgentCard: React.FC<AgentCardProps> = ({
  agent,
  primaryLabel,
  primaryDisabled,
  onPrimaryAction,
  showStats = false,
}) => {
  const isActive = agent.status === 'active';
  return (
    <div className="group card bg-base-100 shadow-sm border border-base-200 hover:shadow-md transition-shadow">
      <div className="card-body gap-3">
        <IconBadge agent={agent} />
        <h3 className="font-bold text-lg leading-tight">{agent.name}</h3>
        <p className="text-sm text-base-content/60 flex-1">
          {agent.description}
        </p>
        <StatusBadge isActive={isActive} />
        {showStats && isActive && <StatsRow agent={agent} />}
        <button
          onClick={onPrimaryAction}
          disabled={primaryDisabled}
          className="btn btn-sm w-full rounded-lg mt-2 border-none bg-gradient-to-r from-secondary/20 to-secondary-deep/60 text-white hover:from-secondary/35 hover:to-secondary-deep/80 disabled:opacity-50"
        >
          {primaryLabel}
        </button>
      </div>
    </div>
  );
};
