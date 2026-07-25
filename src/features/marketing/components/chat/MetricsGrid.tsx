import React from 'react';
import { MetricItem } from '@features/marketing/types/chat-mock';

interface MetricsGridProps {
  metrics: MetricItem[];
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ metrics }) => (
  <div className="rounded-xl border border-base-300 bg-base-100/60 p-4">
    <p className="text-sm font-semibold mb-3">Métricas clave</p>
    <div className="grid grid-cols-2 gap-3">
      {metrics.map((metric) => (
        <div key={metric.label}>
          <p className="text-xs text-base-content/50">{metric.label}</p>
          <p className="text-sm font-bold">
            {metric.value}
            {metric.target && <span className="text-base-content/40 font-normal"> / {metric.target}</span>}
          </p>
        </div>
      ))}
    </div>
  </div>
);
