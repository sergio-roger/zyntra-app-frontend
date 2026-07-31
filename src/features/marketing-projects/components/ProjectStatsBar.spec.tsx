import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { ProjectStatsBar } from '@features/marketing-projects/components/ProjectStatsBar';
import { marketingProjectsApi } from '@features/marketing-projects/api/marketing-projects.api';

vi.mock('@features/marketing-projects/api/marketing-projects.api', () => ({
  marketingProjectsApi: { getStats: vi.fn() },
}));

vi.mock('@features/auth/store/authStore', () => {
  const state = { user: { businessId: 'biz-1' } };
  const useAuthStore = (selector?: (s: typeof state) => unknown) =>
    selector ? selector(state) : state;
  return { useAuthStore };
});

describe('ProjectStatsBar', () => {
  it('shows the four aggregate stats', async () => {
    vi.mocked(marketingProjectsApi.getStats).mockResolvedValue({ active: 12, paused: 3, completed: 24, avgRoi: 245 });
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });

    render(
      <QueryClientProvider client={qc}>
        <ProjectStatsBar />
      </QueryClientProvider>,
    );

    expect(await screen.findByText('12')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('24')).toBeInTheDocument();
    expect(screen.getByText('245%')).toBeInTheDocument();
  });
});
