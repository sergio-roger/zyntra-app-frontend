import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { CompetitorVideoTable } from '@features/youtube-analytics/components/CompetitorVideoTable';
import { YoutubeCompetitorVideoStats } from '@features/youtube-analytics/types/competitor.type';

const videos: YoutubeCompetitorVideoStats[] = [
  {
    id: 'v1',
    competitorChannelId: 'comp-1',
    videoId: 'vid-1',
    date: '2026-07-26',
    title: 'Video A',
    publishedAt: '2026-07-20T00:00:00.000Z',
    views: 100,
    likes: 10,
    comments: 1,
    thumbnailUrl: null,
  },
  {
    id: 'v2',
    competitorChannelId: 'comp-1',
    videoId: 'vid-2',
    date: '2026-07-26',
    title: 'Video B',
    publishedAt: '2026-07-21T00:00:00.000Z',
    views: 500,
    likes: 20,
    comments: 3,
    thumbnailUrl: 'https://img/vid-2.jpg',
  },
];

describe('CompetitorVideoTable', () => {
  it('renders nothing when there are no videos', () => {
    const { container } = render(<CompetitorVideoTable videos={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('sorts by views descending by default', () => {
    render(<CompetitorVideoTable videos={videos} />);
    const rows = screen.getAllByRole('row').slice(1);
    expect(rows[0]).toHaveTextContent('Video B');
    expect(rows[1]).toHaveTextContent('Video A');
  });

  it('links each video title to its YouTube watch page', () => {
    render(<CompetitorVideoTable videos={videos} />);
    const link = screen.getByText('Video B').closest('a');
    expect(link).toHaveAttribute('href', 'https://www.youtube.com/watch?v=vid-2');
  });

  it('re-sorts when clicking a different column header', () => {
    render(<CompetitorVideoTable videos={videos} />);
    fireEvent.click(screen.getByText('Likes'));
    const rows = screen.getAllByRole('row').slice(1);
    expect(rows[0]).toHaveTextContent('Video B');
  });
});
