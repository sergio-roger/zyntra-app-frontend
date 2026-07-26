import { YoutubeCompetitorVideoStats } from '@features/youtube-analytics/types/competitor.type';
import { computeCompetitorMetrics } from '@features/youtube-analytics/utils/compute-competitor-metrics.util';
import React from 'react';

interface CompetitorCardMetricsProps {
  videos: YoutubeCompetitorVideoStats[];
}

export const CompetitorCardMetrics: React.FC<CompetitorCardMetricsProps> = ({
  videos,
}) => {
  const { videoCount, totalViews, avgViews } = computeCompetitorMetrics(videos);

  return (
    <div className="grid grid-cols-3 gap-2 border-t border-base-300 pt-3 text-center">
      <div>
        <p className="text-sm font-bold text-base-content">{videoCount}</p>
        <p className="text-[10px] uppercase tracking-wide text-base-content/50">
          Videos
        </p>
      </div>
      <div>
        <p className="text-sm font-bold text-base-content">
          {totalViews.toLocaleString('es')}
        </p>
        <p className="text-[10px] uppercase tracking-wide text-base-content/50">
          Vistas
        </p>
      </div>
      <div>
        <p className="text-sm font-bold text-base-content">
          {avgViews.toLocaleString('es')}
        </p>
        <p className="text-[10px] uppercase tracking-wide text-base-content/50">
          Promedio
        </p>
      </div>
    </div>
  );
};
