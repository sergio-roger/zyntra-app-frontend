import { YoutubeChannelDailyStats } from '@features/youtube-analytics/types/own-channel.type';
import {
  YoutubeCompetitorChannel,
  YoutubeCompetitorVideoStats,
} from '@features/youtube-analytics/types/competitor.type';

export interface OwnVsCompetitorsSeriesPoint {
  date: string;
  ownViews: number | null;
  competitorViews: Record<string, number | null>;
}

export interface CompetitorSeriesMeta {
  id: string;
  label: string;
}

export interface OwnVsCompetitorsSeries {
  points: OwnVsCompetitorsSeriesPoint[];
  competitors: CompetitorSeriesMeta[];
}

function sumViewsByDate(
  videoStats: YoutubeCompetitorVideoStats[],
  competitorId: string,
): Map<string, number> {
  const totals = new Map<string, number>();
  for (const stat of videoStats) {
    if (stat.competitorChannelId !== competitorId) continue;
    totals.set(stat.date, (totals.get(stat.date) ?? 0) + stat.views);
  }
  return totals;
}

export function buildOwnVsCompetitorsSeries(
  channelDailyStats: YoutubeChannelDailyStats[],
  competitors: YoutubeCompetitorChannel[],
  competitorVideoStats: YoutubeCompetitorVideoStats[],
): OwnVsCompetitorsSeries {
  const ownViewsByDate = new Map(
    channelDailyStats.map((stat) => [stat.date, stat.viewsTotal]),
  );
  const competitorTotalsById = new Map(
    competitors.map((c) => [c.id, sumViewsByDate(competitorVideoStats, c.id)]),
  );

  const allDates = new Set<string>(ownViewsByDate.keys());
  for (const totals of competitorTotalsById.values()) {
    for (const date of totals.keys()) allDates.add(date);
  }
  const sortedDates = [...allDates].sort();

  const points = sortedDates.map((date) => ({
    date,
    ownViews: ownViewsByDate.get(date) ?? null,
    competitorViews: Object.fromEntries(
      competitors.map((c) => [c.id, competitorTotalsById.get(c.id)?.get(date) ?? null]),
    ),
  }));

  const competitorsMeta = competitors.map((c) => ({
    id: c.id,
    label: c.channelHandleOrUrl,
  }));

  return { points, competitors: competitorsMeta };
}
