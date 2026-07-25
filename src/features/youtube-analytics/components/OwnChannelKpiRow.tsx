import { KpiCard } from '@features/youtube-analytics/components/KpiCard';
import {
  YoutubeChannelDailyStats,
  YoutubeVideoDailyStats,
} from '@features/youtube-analytics/types/own-channel.type';
import { getLatestStatsPerVideo } from '@features/youtube-analytics/utils/latest-video-stats.util';
import { Eye, ThumbsDown, ThumbsUp, Users } from 'lucide-react';
import React from 'react';

interface OwnChannelKpiRowProps {
  channelDailyStats: YoutubeChannelDailyStats[];
  videoDailyStats: YoutubeVideoDailyStats[];
}

export const OwnChannelKpiRow: React.FC<OwnChannelKpiRowProps> = ({
  channelDailyStats,
  videoDailyStats,
}) => {
  const latest = channelDailyStats[0];
  const oldest = channelDailyStats[channelDailyStats.length - 1];
  const subscriberGrowth = latest && oldest ? latest.subscribers - oldest.subscribers : 0;

  const videos = getLatestStatsPerVideo(videoDailyStats);
  const bestVideo = videos.length
    ? videos.reduce((a, b) => (b.views > a.views ? b : a))
    : null;
  const worstVideo = videos.length
    ? videos.reduce((a, b) => (b.views < a.views ? b : a))
    : null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard
        icon={Users}
        label="Crecimiento de suscriptores"
        value={subscriberGrowth.toLocaleString('es')}
        trend={{
          value: subscriberGrowth.toLocaleString('es'),
          isPositive: subscriberGrowth >= 0,
        }}
      />
      <KpiCard
        icon={Eye}
        label="Vistas totales"
        value={(latest?.viewsTotal ?? 0).toLocaleString('es')}
      />
      <KpiCard
        icon={ThumbsUp}
        label="Mejor video (vistas)"
        value={bestVideo ? bestVideo.views.toLocaleString('es') : '—'}
      />
      <KpiCard
        icon={ThumbsDown}
        label="Peor video (vistas)"
        value={worstVideo ? worstVideo.views.toLocaleString('es') : '—'}
      />
    </div>
  );
};
