import { YoutubeCompetitorVideoStats } from '@features/youtube-analytics/types/competitor.type';

interface CompetitorMetrics {
  videoCount: number;
  totalViews: number;
  avgViews: number;
}

export function computeCompetitorMetrics(
  videos: YoutubeCompetitorVideoStats[],
): CompetitorMetrics {
  if (videos.length === 0) {
    return { videoCount: 0, totalViews: 0, avgViews: 0 };
  }

  const totalViews = videos.reduce((sum, video) => sum + video.views, 0);

  return {
    videoCount: videos.length,
    totalViews,
    avgViews: Math.round(totalViews / videos.length),
  };
}
