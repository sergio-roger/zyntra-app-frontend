import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { CreditsUsageBadge } from '@features/content-planning/components/CreditsUsageBadge';
import { contentPlanningApi } from '@features/content-planning/api/content-planning.api';

vi.mock('@features/content-planning/api/content-planning.api', () => ({
  contentPlanningApi: { getCreditsUsage: vi.fn() },
}));

vi.mock('@features/auth/store/authStore', () => {
  const state = { user: { businessId: 'biz-1' } };
  const useAuthStore = (selector?: (s: typeof state) => unknown) =>
    selector ? selector(state) : state;
  return { useAuthStore };
});

describe('CreditsUsageBadge', () => {
  it('shows used and limit credits', async () => {
    vi.mocked(contentPlanningApi.getCreditsUsage).mockResolvedValue({ used: 42, limit: 100 });
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });

    render(
      <QueryClientProvider client={qc}>
        <CreditsUsageBadge />
      </QueryClientProvider>,
    );

    expect(await screen.findByText('42/100 créditos')).toBeInTheDocument();
  });
});
