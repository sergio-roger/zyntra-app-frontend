import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useMarketingProjects } from '@features/marketing-projects/hooks/use-marketing-projects';
import { marketingProjectsApi } from '@features/marketing-projects/api/marketing-projects.api';

vi.mock('@features/marketing-projects/api/marketing-projects.api', () => ({
  marketingProjectsApi: { list: vi.fn() },
}));

vi.mock('@features/auth/store/authStore', () => {
  const state = { user: { businessId: 'biz-1' } };
  const useAuthStore = (selector?: (s: typeof state) => unknown) =>
    selector ? selector(state) : state;
  return { useAuthStore };
});

const createWrapper = () => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  );
  return Wrapper;
};

describe('useMarketingProjects', () => {
  it('fetches projects for the current business with the given filters', async () => {
    vi.mocked(marketingProjectsApi.list).mockResolvedValue({ items: [], total: 0 });

    const { result } = renderHook(() => useMarketingProjects({ page: 1, limit: 12 }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.data).toEqual({ items: [], total: 0 }));
    expect(marketingProjectsApi.list).toHaveBeenCalledWith('biz-1', { page: 1, limit: 12 });
  });
});
