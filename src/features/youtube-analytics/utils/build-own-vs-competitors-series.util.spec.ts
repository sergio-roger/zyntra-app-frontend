import { describe, expect, it } from 'vitest';
import { buildOwnVsCompetitorsSeries } from '@features/youtube-analytics/utils/build-own-vs-competitors-series.util';
import { YoutubeChannelDailyStats } from '@features/youtube-analytics/types/own-channel.type';
import {
  YoutubeCompetitorChannel,
  YoutubeCompetitorVideoStats,
} from '@features/youtube-analytics/types/competitor.type';

const channelStats: YoutubeChannelDailyStats[] = [
  {
    id: '1',
    businessId: 'biz-1',
    date: '2026-07-20',
    subscribers: 100,
    subscribersGained: 5,
    subscribersLost: 0,
    viewsTotal: 1000,
    watchTimeMinutes: 500,
  },
  {
    id: '2',
    businessId: 'biz-1',
    date: '2026-07-21',
    subscribers: 105,
    subscribersGained: 5,
    subscribersLost: 0,
    viewsTotal: 1200,
    watchTimeMinutes: 550,
  },
];

const competitorA: YoutubeCompetitorChannel = {
  id: 'comp-a',
  businessId: 'biz-1',
  channelHandleOrUrl: '@a',
  youtubeChannelId: null,
  status: 'fresh',
  lastSyncedAt: '2026-07-21T00:00:00.000Z',
  addedAt: '2026-07-01T00:00:00.000Z',
};

const competitorB: YoutubeCompetitorChannel = {
  ...competitorA,
  id: 'comp-b',
  channelHandleOrUrl: '@b',
};

describe('buildOwnVsCompetitorsSeries', () => {
  it('returns only the own series and no competitor metadata when there are no competitors', () => {
    const result = buildOwnVsCompetitorsSeries(channelStats, [], []);

    expect(result.competitors).toEqual([]);
    expect(result.points).toEqual([
      { date: '2026-07-20', ownViews: 1000, competitorViews: {} },
      { date: '2026-07-21', ownViews: 1200, competitorViews: {} },
    ]);
  });

  it('sums a competitor views across multiple videos on the same date', () => {
    const videoStats: YoutubeCompetitorVideoStats[] = [
      {
        id: 'v1',
        competitorChannelId: 'comp-a',
        videoId: 'vid-1',
        date: '2026-07-20',
        title: 'Video 1',
        publishedAt: '2026-07-19T00:00:00.000Z',
        views: 300,
        likes: 10,
        comments: 1,
        thumbnailUrl: null,
      },
      {
        id: 'v2',
        competitorChannelId: 'comp-a',
        videoId: 'vid-2',
        date: '2026-07-20',
        title: 'Video 2',
        publishedAt: '2026-07-18T00:00:00.000Z',
        views: 200,
        likes: 5,
        comments: 0,
        thumbnailUrl: null,
      },
    ];

    const result = buildOwnVsCompetitorsSeries(channelStats, [competitorA], videoStats);

    expect(result.competitors).toEqual([{ id: 'comp-a', label: '@a' }]);
    expect(result.points[0]).toEqual({
      date: '2026-07-20',
      ownViews: 1000,
      competitorViews: { 'comp-a': 500 },
    });
  });

  it('includes dates that only exist for a competitor, with null for the own channel', () => {
    const videoStats: YoutubeCompetitorVideoStats[] = [
      {
        id: 'v1',
        competitorChannelId: 'comp-a',
        videoId: 'vid-1',
        date: '2026-07-22',
        title: 'Video 1',
        publishedAt: '2026-07-19T00:00:00.000Z',
        views: 400,
        likes: 10,
        comments: 1,
        thumbnailUrl: null,
      },
    ];

    const result = buildOwnVsCompetitorsSeries(channelStats, [competitorA], videoStats);

    expect(result.points).toHaveLength(3);
    expect(result.points[2]).toEqual({
      date: '2026-07-22',
      ownViews: null,
      competitorViews: { 'comp-a': 400 },
    });
  });

  it('fills null for a competitor with no data on a date another competitor has data', () => {
    const videoStats: YoutubeCompetitorVideoStats[] = [
      {
        id: 'v1',
        competitorChannelId: 'comp-b',
        videoId: 'vid-1',
        date: '2026-07-20',
        title: 'Video 1',
        publishedAt: '2026-07-19T00:00:00.000Z',
        views: 150,
        likes: 2,
        comments: 0,
        thumbnailUrl: null,
      },
    ];

    const result = buildOwnVsCompetitorsSeries(
      channelStats,
      [competitorA, competitorB],
      videoStats,
    );

    expect(result.competitors).toEqual([
      { id: 'comp-a', label: '@a' },
      { id: 'comp-b', label: '@b' },
    ]);
    expect(result.points[0].competitorViews).toEqual({
      'comp-a': null,
      'comp-b': 150,
    });
  });
});
