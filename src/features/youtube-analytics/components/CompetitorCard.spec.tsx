import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { CompetitorCard } from '@features/youtube-analytics/components/CompetitorCard';
import { YoutubeCompetitorChannel, YoutubeCompetitorVideoStats } from '@features/youtube-analytics/types/competitor.type';

vi.mock('@features/youtube-analytics/hooks/useCompetitors', () => ({
  useRemoveCompetitor: () => ({ mutate: vi.fn(), isPending: false }),
}));

const competitor: YoutubeCompetitorChannel = {
  id: 'comp-1',
  businessId: 'biz-1',
  channelHandleOrUrl: '@somecompetitor',
  youtubeChannelId: null,
  status: 'fresh',
  lastSyncedAt: '2026-07-25T00:00:00.000Z',
  addedAt: '2026-07-20T00:00:00.000Z',
};

const videos: YoutubeCompetitorVideoStats[] = [
  {
    id: 'v1',
    competitorChannelId: 'comp-1',
    videoId: 'vid-1',
    date: '2026-07-26',
    title: 'Video top',
    publishedAt: '2026-07-20T00:00:00.000Z',
    views: 300,
    likes: 10,
    comments: 1,
    thumbnailUrl: 'https://img/vid-1.jpg',
  },
  {
    id: 'v2',
    competitorChannelId: 'comp-1',
    videoId: 'vid-2',
    date: '2026-07-26',
    title: 'Otro video',
    publishedAt: '2026-07-19T00:00:00.000Z',
    views: 100,
    likes: 5,
    comments: 0,
    thumbnailUrl: null,
  },
];

function renderCard() {
  return render(
    <MemoryRouter>
      <CompetitorCard competitor={competitor} videos={videos} />
    </MemoryRouter>,
  );
}

describe('CompetitorCard', () => {
  it('shows the quick metrics computed from the videos', () => {
    renderCard();

    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('400')).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
  });

  it('links the handle to the channel on YouTube', () => {
    renderCard();

    const link = screen.getByText('@somecompetitor').closest('a');
    expect(link).toHaveAttribute('href', 'https://www.youtube.com/@somecompetitor');
  });

  it('renders a hover link to the competitor detail page', () => {
    renderCard();

    const detailLink = screen.getByText('Ver todos los videos').closest('a');
    expect(detailLink).toHaveAttribute('href', '/redes-sociales/youtube/competencia/comp-1');
  });
});
