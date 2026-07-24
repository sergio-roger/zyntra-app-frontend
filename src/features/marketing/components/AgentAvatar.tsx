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
import { SystemAgentCatalogItem } from '@features/marketing/types/agents';

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

interface AgentAvatarProps {
  agent: SystemAgentCatalogItem;
  size?: 'md' | 'lg';
  shape?: 'circle' | 'panel';
  bleed?: boolean;
}

export const AgentAvatar: React.FC<AgentAvatarProps> = ({
  agent,
  size = 'md',
  shape = 'circle',
  bleed = false,
}) => {
  const isPanel = shape === 'panel';
  const dimension = isPanel ? 'w-full h-full' : size === 'lg' ? 'w-20 h-20' : 'w-14 h-14';
  const rounding = bleed ? '' : isPanel ? 'rounded-2xl' : 'rounded-full';
  const border = bleed ? '' : 'border border-base-content/10';
  const frameClasses = `${dimension} ${rounding} overflow-hidden bg-base-300 ${border} shrink-0`;
  const color = agent.category?.color ?? '#7c3aed';

  if (agent.avatarUrl) {
    return (
      <div className={frameClasses}>
        <img
          src={agent.avatarUrl}
          alt={agent.name}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  const Icon = SLUG_ICONS[agent.slug] ?? Bot;
  return (
    <div
      className={`${frameClasses} flex items-center justify-center transition-transform duration-200 group-hover:scale-110`}
      style={
        isPanel
          ? {
              backgroundImage: `radial-gradient(circle at 50% 35%, ${color}33 0%, transparent 70%)`,
              color,
            }
          : { color }
      }
    >
      <Icon size={isPanel ? 72 : size === 'lg' ? 36 : 24} strokeWidth={isPanel ? 1.5 : 2} />
    </div>
  );
};
