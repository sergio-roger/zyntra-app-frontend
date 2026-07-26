import { KpiCard } from '@features/youtube-analytics/components/KpiCard';
import { YoutubeCompetitorVideoStats } from '@features/youtube-analytics/types/competitor.type';
import { computeCompetitorMetrics } from '@features/youtube-analytics/utils/compute-competitor-metrics.util';
import { Eye, ThumbsUp, TrendingUp, Video } from 'lucide-react';
import React from 'react';

interface CompetitorDetailKpiRowProps {
  videos: YoutubeCompetitorVideoStats[];
}

export const CompetitorDetailKpiRow: React.FC<CompetitorDetailKpiRowProps> = ({
  videos,
}) => {
  const { videoCount, totalViews, avgViews } = computeCompetitorMetrics(videos);
  const bestVideo = videos.length
    ? videos.reduce((a, b) => (b.views > a.views ? b : a))
    : null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard icon={Video} label="Videos monitoreados" value={String(videoCount)} />
      <KpiCard
        icon={Eye}
        label="Vistas totales"
        value={totalViews.toLocaleString('es')}
      />
      <KpiCard
        icon={TrendingUp}
        label="Promedio de vistas"
        value={avgViews.toLocaleString('es')}
      />
      <KpiCard
        icon={ThumbsUp}
        label="Mejor video (vistas)"
        value={bestVideo ? bestVideo.views.toLocaleString('es') : '—'}
      />
    </div>
  );
};
