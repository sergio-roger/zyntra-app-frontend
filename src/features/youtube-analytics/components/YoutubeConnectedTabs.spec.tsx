import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { YoutubeConnectedTabs } from '@features/youtube-analytics/components/YoutubeConnectedTabs';

const useOwnChannelDashboardMock = vi.fn();
const useDisconnectOwnChannelMock = vi.fn();
const useCompetitorsDashboardMock = vi.fn();

vi.mock('@features/youtube-analytics/hooks/useOwnChannel', () => ({
  useOwnChannelDashboard: () => useOwnChannelDashboardMock(),
  useDisconnectOwnChannel: () => useDisconnectOwnChannelMock(),
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

function renderTabs() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <YoutubeConnectedTabs />
    </QueryClientProvider>,
  );
}

describe('YoutubeConnectedTabs', () => {
  beforeEach(() => {
    useOwnChannelDashboardMock.mockReturnValue({
      data: { channelDailyStats: [], videoDailyStats: [] },
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

  it('shows the Canal tab content by default', () => {
    renderTabs();

    expect(screen.getByText('Canal propio')).toBeInTheDocument();
  });

  it('switches to the Competencia tab content on click', async () => {
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

    renderTabs();
    fireEvent.click(screen.getByText('Competencia'));

    expect(screen.getByText('@competidor')).toBeInTheDocument();
    expect(screen.getByText('Stale')).toBeInTheDocument();
  });

  it('disables adding a new competitor once the plan limit is reached', async () => {
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

    renderTabs();
    fireEvent.click(screen.getByText('Competencia'));

    expect(screen.getByText('Agregar otro')).toBeDisabled();
    expect(screen.getByText(/Alcanzaste el límite de 3 canales/)).toBeInTheDocument();
  });

  it('switches to the Dashboard tab content on click', async () => {
    renderTabs();
    fireEvent.click(screen.getByText('Dashboard'));

    expect(screen.getByText('Todavía no hay datos de tu canal')).toBeInTheDocument();
  });
});
