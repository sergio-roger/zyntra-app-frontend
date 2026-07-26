import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { YoutubeComparisonDashboard } from '@features/youtube-analytics/components/YoutubeComparisonDashboard';

const useOwnChannelDashboardMock = vi.fn();
const useCompetitorsDashboardMock = vi.fn();

vi.mock('@features/youtube-analytics/hooks/useOwnChannel', () => ({
  useOwnChannelDashboard: () => useOwnChannelDashboardMock(),
}));

vi.mock('@features/youtube-analytics/hooks/useCompetitors', () => ({
  useCompetitorsDashboard: () => useCompetitorsDashboardMock(),
}));

const channelDailyStats = [
  {
    id: '1',
    businessId: 'biz-1',
    date: '2026-07-25',
    subscribers: 1200,
    subscribersGained: 20,
    subscribersLost: 2,
    viewsTotal: 50000,
    watchTimeMinutes: 3000,
  },
];

const videoDailyStats = [
  {
    id: 'v1',
    businessId: 'biz-1',
    videoId: 'vid-1',
    date: '2026-07-25',
    views: 900,
    likes: 40,
    comments: 5,
    avgViewDuration: 80,
    thumbnailCtr: 3.1,
    trafficSource: {},
  },
];

function renderDashboard() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <YoutubeComparisonDashboard />
    </QueryClientProvider>,
  );
}

describe('YoutubeComparisonDashboard', () => {
  beforeEach(() => {
    useOwnChannelDashboardMock.mockReturnValue({
      data: { channelDailyStats, videoDailyStats },
      isLoading: false,
      isError: false,
    });
  });

  it('shows an empty state and the own-channel chart when there are no competitors', () => {
    useCompetitorsDashboardMock.mockReturnValue({
      data: { competitors: [], competitorVideoStats: [] },
      isLoading: false,
      isError: false,
    });

    renderDashboard();

    expect(screen.getByText('Tu canal')).toBeInTheDocument();
    expect(screen.getByText('Todavía no monitoreás competencia')).toBeInTheDocument();
  });

  it('renders the comparison KPI grid and chart when there are competitors', () => {
    useCompetitorsDashboardMock.mockReturnValue({
      data: {
        competitors: [
          {
            id: 'comp-a',
            businessId: 'biz-1',
            channelHandleOrUrl: '@a',
            youtubeChannelId: null,
            status: 'fresh',
            lastSyncedAt: '2026-07-25T00:00:00.000Z',
            addedAt: '2026-07-01T00:00:00.000Z',
          },
        ],
        competitorVideoStats: [
          {
            id: 'cv1',
            competitorChannelId: 'comp-a',
            videoId: 'comp-vid-1',
            date: '2026-07-25',
            title: 'Competitor video',
            publishedAt: '2026-07-20T00:00:00.000Z',
            views: 300,
            likes: 5,
            comments: 0,
          },
        ],
      },
      isLoading: false,
      isError: false,
    });

    renderDashboard();

    expect(screen.getByText('Tu canal')).toBeInTheDocument();
    expect(screen.getByText('@a')).toBeInTheDocument();
    expect(screen.getByText('Vistas: canal propio vs. competencia')).toBeInTheDocument();
  });

  it('shows a single error alert when either dashboard fails', () => {
    useCompetitorsDashboardMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });

    renderDashboard();

    expect(
      screen.getByText('No se pudo cargar la comparación. Intenta de nuevo.'),
    ).toBeInTheDocument();
  });

  it('shows a loading spinner while either dashboard is loading', () => {
    useCompetitorsDashboardMock.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });

    const { container } = renderDashboard();

    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('shows an empty state when the own channel has no data yet', () => {
    useOwnChannelDashboardMock.mockReturnValue({
      data: { channelDailyStats: [], videoDailyStats: [] },
      isLoading: false,
      isError: false,
    });
    useCompetitorsDashboardMock.mockReturnValue({
      data: { competitors: [], competitorVideoStats: [] },
      isLoading: false,
      isError: false,
    });

    renderDashboard();

    expect(screen.getByText('Todavía no hay datos de tu canal')).toBeInTheDocument();
  });
});
