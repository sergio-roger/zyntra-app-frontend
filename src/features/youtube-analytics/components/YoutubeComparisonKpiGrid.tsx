import { ComparisonEntityCard } from '@features/youtube-analytics/components/ComparisonEntityCard';
import {
  YoutubeCompetitorChannel,
  YoutubeCompetitorVideoStats,
} from '@features/youtube-analytics/types/competitor.type';
import {
  YoutubeChannelDailyStats,
  YoutubeVideoDailyStats,
} from '@features/youtube-analytics/types/own-channel.type';
import { getLatestStatsPerVideo } from '@features/youtube-analytics/utils/latest-video-stats.util';
import React from 'react';

interface YoutubeComparisonKpiGridProps {
  channelDailyStats: YoutubeChannelDailyStats[];
  ownVideoDailyStats: YoutubeVideoDailyStats[];
  competitors: YoutubeCompetitorChannel[];
  competitorVideoStats: YoutubeCompetitorVideoStats[];
}

function bestVideoViews(views: number[]): number | null {
  return views.length ? Math.max(...views) : null;
}

export const YoutubeComparisonKpiGrid: React.FC<YoutubeComparisonKpiGridProps> = ({
  channelDailyStats,
  ownVideoDailyStats,
  competitors,
  competitorVideoStats,
}) => {
  const ownTotalViews = channelDailyStats[0]?.viewsTotal ?? 0;
  const ownVideos = getLatestStatsPerVideo(ownVideoDailyStats);
  const ownBestVideoViews = bestVideoViews(ownVideos.map((video) => video.views));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <ComparisonEntityCard
        label="Tu canal"
        totalViews={ownTotalViews}
        bestVideoViews={ownBestVideoViews}
      />
      {competitors.map((competitor) => {
        const videos = competitorVideoStats.filter(
          (video) => video.competitorChannelId === competitor.id,
        );
        const totalViews = videos.reduce((sum, video) => sum + video.views, 0);
        return (
          <ComparisonEntityCard
            key={competitor.id}
            label={competitor.channelHandleOrUrl}
            totalViews={totalViews}
            bestVideoViews={bestVideoViews(videos.map((video) => video.views))}
          />
        );
      })}
    </div>
  );
};
