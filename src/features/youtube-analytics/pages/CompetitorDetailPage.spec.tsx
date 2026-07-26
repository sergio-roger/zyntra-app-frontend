import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CompetitorDetailPage } from '@features/youtube-analytics/pages/CompetitorDetailPage';

const useCompetitorsDashboardMock = vi.fn();
const useCompetitorVideosMock = vi.fn();

vi.mock('@features/youtube-analytics/hooks/useCompetitors', () => ({
  useCompetitorsDashboard: () => useCompetitorsDashboardMock(),
  useCompetitorVideos: () => useCompetitorVideosMock(),
  useRemoveCompetitor: () => ({ mutate: vi.fn(), isPending: false }),
}));

function renderPage() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={['/redes-sociales/youtube/competencia/comp-1']}>
        <Routes>
          <Route
            path="/redes-sociales/youtube/competencia/:competitorId"
            element={<CompetitorDetailPage />}
          />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('CompetitorDetailPage', () => {
  beforeEach(() => {
    useCompetitorsDashboardMock.mockReturnValue({
      data: {
        competitors: [
          {
            id: 'comp-1',
            businessId: 'biz-1',
            channelHandleOrUrl: '@somecompetitor',
            youtubeChannelId: null,
            status: 'fresh',
            lastSyncedAt: '2026-07-25T00:00:00.000Z',
            addedAt: '2026-07-20T00:00:00.000Z',
          },
        ],
        competitorVideoStats: [],
      },
      isLoading: false,
    });
  });

  it('shows a loading state while videos are loading', () => {
    useCompetitorVideosMock.mockReturnValue({ data: undefined, isLoading: true });

    const { container } = renderPage();

    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('shows the empty state when the competitor has no videos', () => {
    useCompetitorVideosMock.mockReturnValue({ data: [], isLoading: false });

    renderPage();

    expect(
      screen.getByText('Todavía no hay videos monitoreados para este competidor.'),
    ).toBeInTheDocument();
  });

  it('shows the handle linked to YouTube and the video table when there is data', () => {
    useCompetitorVideosMock.mockReturnValue({
      isLoading: false,
      data: [
        {
          id: 'v1',
          competitorChannelId: 'comp-1',
          videoId: 'vid-1',
          date: '2026-07-26',
          title: 'Video de competencia',
          publishedAt: '2026-07-20T00:00:00.000Z',
          views: 500,
          likes: 20,
          comments: 3,
          thumbnailUrl: null,
        },
      ],
    });

    renderPage();

    const link = screen.getByText('@somecompetitor').closest('a');
    expect(link).toHaveAttribute('href', 'https://www.youtube.com/@somecompetitor');
    expect(screen.getByText('Video de competencia')).toBeInTheDocument();
  });
});
