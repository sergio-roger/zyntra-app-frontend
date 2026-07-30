import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useCreateContentPlan } from '@features/content-planning/hooks/use-create-content-plan';
import { contentPlanningApi } from '@features/content-planning/api/content-planning.api';

vi.mock('@features/content-planning/api/content-planning.api', () => ({
  contentPlanningApi: { createPlan: vi.fn() },
}));

vi.mock('@features/auth/store/authStore', () => {
  const state = { user: { businessId: 'biz-1' } };
  const useAuthStore = (selector?: (s: typeof state) => unknown) =>
    selector ? selector(state) : state;
  return { useAuthStore };
});

vi.mock('@shared/components/toast/toastManager', () => ({
  toastManager: { add: vi.fn() },
}));

const createWrapper = () => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  );
  return Wrapper;
};

describe('useCreateContentPlan', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls the API with the business id and the payload', async () => {
    vi.mocked(contentPlanningApi.createPlan).mockResolvedValue({
      id: 'plan-1',
      name: 'Agosto',
      periodType: 'monthly',
      startDate: '2026-08-01',
      endDate: '2026-08-31',
      status: 'draft',
    });

    const { result } = renderHook(() => useCreateContentPlan(), { wrapper: createWrapper() });

    await act(async () => {
      await result.current.mutateAsync({
        name: 'Agosto',
        periodType: 'monthly',
        startDate: '2026-08-01',
        endDate: '2026-08-31',
        brief: 'Lanzamiento',
        platformConfigs: [],
      });
    });

    expect(contentPlanningApi.createPlan).toHaveBeenCalledWith('biz-1', expect.objectContaining({ name: 'Agosto' }));
  });
});
