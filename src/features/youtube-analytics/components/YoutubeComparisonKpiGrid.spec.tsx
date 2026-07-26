// frontend/src/features/youtube-analytics/components/YoutubeComparisonKpiGrid.spec.tsx
import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { YoutubeComparisonKpiGrid } from '@features/youtube-analytics/components/YoutubeComparisonKpiGrid';

describe('YoutubeComparisonKpiGrid', () => {
  it('renders own channel and one card per competitor with summed views', () => {
    render(
      <YoutubeComparisonKpiGrid
        channelDailyStats={[
          {
            id: '1',
            businessId: 'biz-1',
            date: '2026-07-21',
            subscribers: 100,
            subscribersGained: 0,
            subscribersLost: 0,
            viewsTotal: 15000,
            watchTimeMinutes: 100,
          },
        ]}
        ownVideoDailyStats={[
          {
            id: 'v1',
            businessId: 'biz-1',
            videoId: 'own-vid',
            date: '2026-07-21',
            views: 400,
            likes: 10,
            comments: 1,
            avgViewDuration: 60,
            thumbnailCtr: 2,
            trafficSource: {},
          },
        ]}
        competitors={[
          {
            id: 'comp-a',
            businessId: 'biz-1',
            channelHandleOrUrl: '@a',
            youtubeChannelId: null,
            status: 'fresh',
            lastSyncedAt: '2026-07-21T00:00:00.000Z',
            addedAt: '2026-07-01T00:00:00.000Z',
          },
        ]}
        competitorVideoStats={[
          {
            id: 'cv1',
            competitorChannelId: 'comp-a',
            videoId: 'comp-vid-1',
            date: '2026-07-21',
            title: 'Competitor video',
            publishedAt: '2026-07-20T00:00:00.000Z',
            views: 300,
            likes: 5,
            comments: 0,
            thumbnailUrl: null,
          },
          {
            id: 'cv2',
            competitorChannelId: 'comp-a',
            videoId: 'comp-vid-2',
            date: '2026-07-21',
            title: 'Competitor video 2',
            publishedAt: '2026-07-20T00:00:00.000Z',
            views: 150,
            likes: 1,
            comments: 0,
            thumbnailUrl: null,
          },
        ]}
      />,
    );

    expect(screen.getByText('Tu canal')).toBeInTheDocument();
    expect(screen.getByText('15.000')).toBeInTheDocument();
    expect(screen.getByText('400')).toBeInTheDocument();
    expect(screen.getByText('@a')).toBeInTheDocument();
    expect(screen.getByText('300')).toBeInTheDocument();
  });
});
