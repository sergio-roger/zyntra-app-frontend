import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useContentPlans } from '@features/content-planning/hooks/use-content-plans';
import { contentPlanningApi } from '@features/content-planning/api/content-planning.api';

vi.mock('@features/content-planning/api/content-planning.api', () => ({
  contentPlanningApi: { listPlans: vi.fn() },
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

describe('useContentPlans', () => {
  it('fetches plans for the current business', async () => {
    vi.mocked(contentPlanningApi.listPlans).mockResolvedValue([
      { id: 'plan-1', name: 'Agosto', periodType: 'monthly', startDate: '2026-08-01', endDate: '2026-08-31', status: 'draft' },
    ]);

    const { result } = renderHook(() => useContentPlans(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.data).toHaveLength(1));
    expect(contentPlanningApi.listPlans).toHaveBeenCalledWith('biz-1');
  });
});
