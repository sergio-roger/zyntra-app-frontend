import { YoutubeVideoDailyStats } from '@features/youtube-analytics/types/own-channel.type';

// El backend devuelve una fila por video y por día; para el ranking solo
// interesa el snapshot más reciente de cada video (asume input ya viene
// ordenado DESC por fecha, como lo entrega el endpoint de dashboard).
export function getLatestStatsPerVideo(
  videoDailyStats: YoutubeVideoDailyStats[],
): YoutubeVideoDailyStats[] {
  const seen = new Set<string>();
  const result: YoutubeVideoDailyStats[] = [];

  for (const stat of videoDailyStats) {
    if (seen.has(stat.videoId)) continue;
    seen.add(stat.videoId);
    result.push(stat);
  }

  return result;
}
