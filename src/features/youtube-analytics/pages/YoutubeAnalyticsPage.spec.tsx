import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { YoutubeAnalyticsPage } from '@features/youtube-analytics/pages/YoutubeAnalyticsPage';

const useOwnChannelStatusMock = vi.fn();
const useOwnChannelDashboardMock = vi.fn();
const useDisconnectOwnChannelMock = vi.fn();
const useCompetitorsDashboardMock = vi.fn();

vi.mock('@features/youtube-analytics/hooks/useOwnChannel', () => ({
  useOwnChannelStatus: () => useOwnChannelStatusMock(),
  useOwnChannelDashboard: () => useOwnChannelDashboardMock(),
  useDisconnectOwnChannel: () => useDisconnectOwnChannelMock(),
  ownChannelKeys: { status: ['youtube-analytics', 'own-channel', 'status'] },
  buildYoutubeOAuthConnectUrl: () => 'http://localhost:3000/api/youtube-analytics/oauth/connect',
}));

vi.mock('@features/youtube-analytics/hooks/useCompetitors', () => ({
  useCompetitorsDashboard: () => useCompetitorsDashboardMock(),
  useCreateCompetitor: () => ({ mutate: vi.fn(), isPending: false }),
  useRemoveCompetitor: () => ({ mutate: vi.fn(), isPending: false }),
}));

vi.mock('@features/auth/store/authStore', () => {
  const state = { user: { plan: { youtubeCompetitorLimit: 3 } } };
  const useAuthStore = (selector?: (s: typeof state) => unknown) =>
    selector ? selector(state) : state;
  return { useAuthStore };
});

function renderPage() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={['/redes-sociales/youtube']}>
        <YoutubeAnalyticsPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('YoutubeAnalyticsPage', () => {
  beforeEach(() => {
    useOwnChannelDashboardMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
    });
    useDisconnectOwnChannelMock.mockReturnValue({ mutate: vi.fn(), isPending: false });
    useCompetitorsDashboardMock.mockReturnValue({
      data: { competitors: [], competitorVideoStats: [] },
      isLoading: false,
      isError: false,
    });
  });

  it('shows the connect CTA when no channel is connected', () => {
    useOwnChannelStatusMock.mockReturnValue({ data: null, isLoading: false });

    renderPage();

    expect(screen.getByText('Conectá tu canal de YouTube')).toBeInTheDocument();
    expect(screen.getByText('Conectar con Google')).toBeInTheDocument();
  });

  it('shows a loading state while the connection status is being fetched', () => {
    useOwnChannelStatusMock.mockReturnValue({ data: undefined, isLoading: true });

    const { container } = renderPage();

    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('shows the dashboard KPIs and video ranking once connected with data', () => {
    useOwnChannelStatusMock.mockReturnValue({
      data: { status: 'connected', youtubeChannelId: 'UC123' },
      isLoading: false,
    });
    useOwnChannelDashboardMock.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        channelDailyStats: [
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
          {
            id: '2',
            businessId: 'biz-1',
            date: '2026-07-20',
            subscribers: 1100,
            subscribersGained: 15,
            subscribersLost: 1,
            viewsTotal: 48000,
            watchTimeMinutes: 2800,
          },
        ],
        videoDailyStats: [
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
        ],
      },
    });

    renderPage();

    expect(screen.getByText('Canal propio')).toBeInTheDocument();
    expect(screen.getByText('50.000')).toBeInTheDocument();
    expect(screen.getByText('vid-1')).toBeInTheDocument();
  });

  it('shows a stale badge for a competitor that failed to sync', () => {
    useOwnChannelStatusMock.mockReturnValue({ data: null, isLoading: false });
    useCompetitorsDashboardMock.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        competitors: [
          {
            id: 'comp-1',
            businessId: 'biz-1',
            channelHandleOrUrl: '@competidor',
            youtubeChannelId: null,
            status: 'stale',
            lastSyncedAt: null,
            addedAt: '2026-07-20T00:00:00.000Z',
          },
        ],
        competitorVideoStats: [],
      },
    });

    renderPage();

    expect(screen.getByText('@competidor')).toBeInTheDocument();
    expect(screen.getByText('Stale')).toBeInTheDocument();
  });

  it('disables adding a new competitor once the plan limit is reached', () => {
    useOwnChannelStatusMock.mockReturnValue({ data: null, isLoading: false });
    useCompetitorsDashboardMock.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        competitors: [
          {
            id: 'comp-1',
            businessId: 'biz-1',
            channelHandleOrUrl: '@a',
            youtubeChannelId: null,
            status: 'fresh',
            lastSyncedAt: '2026-07-25T00:00:00.000Z',
            addedAt: '2026-07-20T00:00:00.000Z',
          },
          {
            id: 'comp-2',
            businessId: 'biz-1',
            channelHandleOrUrl: '@b',
            youtubeChannelId: null,
            status: 'fresh',
            lastSyncedAt: '2026-07-25T00:00:00.000Z',
            addedAt: '2026-07-20T00:00:00.000Z',
          },
          {
            id: 'comp-3',
            businessId: 'biz-1',
            channelHandleOrUrl: '@c',
            youtubeChannelId: null,
            status: 'fresh',
            lastSyncedAt: '2026-07-25T00:00:00.000Z',
            addedAt: '2026-07-20T00:00:00.000Z',
          },
        ],
        competitorVideoStats: [],
      },
    });

    renderPage();

    expect(screen.getByText('Agregar otro')).toBeDisabled();
    expect(screen.getByText(/Alcanzaste el límite de 3 canales/)).toBeInTheDocument();
  });
});
