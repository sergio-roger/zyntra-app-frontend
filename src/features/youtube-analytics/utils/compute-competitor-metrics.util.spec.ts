import { describe, expect, it } from 'vitest';
import { computeCompetitorMetrics } from '@features/youtube-analytics/utils/compute-competitor-metrics.util';
import { YoutubeCompetitorVideoStats } from '@features/youtube-analytics/types/competitor.type';

function video(views: number): YoutubeCompetitorVideoStats {
  return { views } as YoutubeCompetitorVideoStats;
}

describe('computeCompetitorMetrics', () => {
  it('computes count, total and average views', () => {
    const result = computeCompetitorMetrics([video(100), video(200), video(300)]);

    expect(result).toEqual({ videoCount: 3, totalViews: 600, avgViews: 200 });
  });

  it('returns zeros for an empty list', () => {
    expect(computeCompetitorMetrics([])).toEqual({
      videoCount: 0,
      totalViews: 0,
      avgViews: 0,
    });
  });

  it('rounds the average to the nearest integer', () => {
    const result = computeCompetitorMetrics([video(100), video(101)]);
    expect(result.avgViews).toBe(101);
  });
});
