import { KpiCard } from '@features/youtube-analytics/components/KpiCard';
import { Eye, ThumbsUp } from 'lucide-react';
import React from 'react';

interface ComparisonEntityCardProps {
  label: string;
  totalViews: number;
  bestVideoViews: number | null;
}

export const ComparisonEntityCard: React.FC<ComparisonEntityCardProps> = ({
  label,
  totalViews,
  bestVideoViews,
}) => {
  return (
    <div className="card bg-base-100 border border-base-300 shadow-sm">
      <div className="card-body gap-3 p-5">
        <h3 className="text-sm font-bold text-base-content truncate">{label}</h3>
        <div className="grid grid-cols-2 gap-3">
          <KpiCard icon={Eye} label="Vistas totales" value={totalViews.toLocaleString('es')} />
          <KpiCard
            icon={ThumbsUp}
            label="Mejor video"
            value={bestVideoViews !== null ? bestVideoViews.toLocaleString('es') : '—'}
          />
        </div>
      </div>
    </div>
  );
};
