import React from 'react';
import { PlayCircle, PauseCircle, CheckCircle2, TrendingUp } from 'lucide-react';
import { useMarketingProjectStats } from '@features/marketing-projects/hooks/use-marketing-project-stats';
import { CardWrapper } from '@shared/components/CardWrapper';

export const ProjectStatsBar: React.FC = () => {
  const { data } = useMarketingProjectStats();
  if (!data) return null;

  const cards = [
    { label: 'Activos', value: data.active, icon: PlayCircle, color: 'text-success' },
    { label: 'En Pausa', value: data.paused, icon: PauseCircle, color: 'text-warning' },
    { label: 'Completados', value: data.completed, icon: CheckCircle2, color: 'text-info' },
    { label: 'ROI Promedio', value: `${Math.round(data.avgRoi)}%`, icon: TrendingUp, color: 'text-primary' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map(({ label, value, icon: Icon, color }) => (
        <CardWrapper key={label} hoverable={false} className="p-4 gap-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-base-content/50 uppercase">{label}</span>
            <Icon size={16} className={color} />
          </div>
          <p className="text-2xl font-bold text-base-content">{value}</p>
        </CardWrapper>
      ))}
    </div>
  );
};

export default ProjectStatsBar;
