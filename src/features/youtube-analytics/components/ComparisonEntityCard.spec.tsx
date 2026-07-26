import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { ComparisonEntityCard } from '@features/youtube-analytics/components/ComparisonEntityCard';

describe('ComparisonEntityCard', () => {
  it('renders the label, total views and best video views', () => {
    render(
      <ComparisonEntityCard label="Tu canal" totalViews={12345} bestVideoViews={16789} />,
    );

    expect(screen.getByText('Tu canal')).toBeInTheDocument();
    expect(screen.getByText('12.345')).toBeInTheDocument();
    expect(screen.getByText('16.789')).toBeInTheDocument();
  });

  it('renders a dash when there is no best video yet', () => {
    render(<ComparisonEntityCard label="@competidor" totalViews={0} bestVideoViews={null} />);

    expect(screen.getByText('—')).toBeInTheDocument();
  });
});
