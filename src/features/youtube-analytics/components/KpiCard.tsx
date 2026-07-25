import { LucideIcon } from 'lucide-react';
import React from 'react';

interface KpiCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  trend?: { value: string; isPositive: boolean };
}

export const KpiCard: React.FC<KpiCardProps> = ({
  icon: Icon,
  label,
  value,
  trend,
}) => {
  return (
    <div className="card bg-base-100 border border-base-300 shadow-sm">
      <div className="card-body gap-2 p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-base-content/60">
            {label}
          </span>
          <Icon size={18} className="text-error" />
        </div>
        <div className="flex items-end justify-between gap-2">
          <span className="text-2xl font-bold text-base-content tracking-tight">
            {value}
          </span>
          {trend && (
            <span
              className={`text-xs font-semibold ${
                trend.isPositive ? 'text-success' : 'text-error'
              }`}
            >
              {trend.isPositive ? '+' : ''}
              {trend.value}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
