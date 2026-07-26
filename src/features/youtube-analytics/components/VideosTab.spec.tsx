import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { VideosTab } from '@features/youtube-analytics/components/VideosTab';

const useInterestVideosMock = vi.fn();

vi.mock('@features/youtube-analytics/hooks/useVideoInterests', () => ({
  useInterestVideos: () => useInterestVideosMock(),
}));

function renderTab() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <VideosTab />
    </QueryClientProvider>,
  );
}

describe('VideosTab', () => {
  it('shows a loading skeleton while videos are not ready', () => {
    useInterestVideosMock.mockReturnValue({ data: [], isLoading: true });

    renderTab();

    expect(screen.getByText('Buscando videos para vos...')).toBeInTheDocument();
  });

  it('shows a loading skeleton when the scraping job has not finished yet', () => {
    useInterestVideosMock.mockReturnValue({ data: [], isLoading: false });

    renderTab();

    expect(screen.getByText('Buscando videos para vos...')).toBeInTheDocument();
  });

  it('renders a card per video once results are ready', () => {
    useInterestVideosMock.mockReturnValue({
      isLoading: false,
      data: [
        {
          id: 'v1',
          businessId: 'biz-1',
          videoId: 'vid-1',
          title: 'Marketing digital para principiantes',
          channelName: 'Canal de Marketing',
          thumbnailUrl: null,
          viewCount: 5000,
          likeCount: 300,
          durationSeconds: 610,
          uploadedAt: '2026-07-10T00:00:00.000Z',
          fetchedAt: '2026-07-25T00:00:00.000Z',
        },
      ],
    });

    renderTab();

    expect(
      screen.getByText('Marketing digital para principiantes'),
    ).toBeInTheDocument();
    expect(screen.getByText('Canal de Marketing')).toBeInTheDocument();
  });
});
