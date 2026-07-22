import {
  Bot,
  CheckCircle2,
  Clock,
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
  const color = agent.category?.color ?? '#6366f1';
  return (
    <div
      className="w-12 h-12 rounded-xl flex items-center justify-center"
      style={{ backgroundColor: `${color}1a`, color }}
    >
      <Icon size={24} />
    </div>
  );
};

const StatusBadge: React.FC<{ isActive: boolean }> = ({ isActive }) =>
  isActive ? (
    <span className="badge badge-success gap-1">
      <CheckCircle2 size={12} /> Activo
    </span>
  ) : (
    <span className="badge badge-ghost gap-1">
      <Clock size={12} /> Próximamente
    </span>
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
}

export const AgentCard: React.FC<AgentCardProps> = ({
  agent,
  primaryLabel,
  primaryDisabled,
  onPrimaryAction,
}) => {
  const isActive = agent.status === 'active';
  return (
    <div className="card bg-base-100 shadow-sm border border-base-200 hover:shadow-md transition-shadow">
      <div className="card-body gap-3">
        <IconBadge agent={agent} />
        <h3 className="font-bold text-lg leading-tight">{agent.name}</h3>
        <p className="text-sm text-base-content/60 flex-1">
          {agent.description}
        </p>
        <StatusBadge isActive={isActive} />
        {isActive && <StatsRow agent={agent} />}
        <button
          onClick={onPrimaryAction}
          disabled={primaryDisabled}
          className="btn btn-primary btn-sm mt-2"
        >
          {primaryLabel}
        </button>
      </div>
    </div>
  );
};
