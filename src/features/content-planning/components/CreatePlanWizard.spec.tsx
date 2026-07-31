import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { CreatePlanWizard } from '@features/content-planning/components/CreatePlanWizard';
import { contentPlanningApi } from '@features/content-planning/api/content-planning.api';
import { ContentPlanPlatform } from '@features/content-planning/enums/content-plan-platform.enum';

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

const renderWithClient = (ui: React.ReactElement) => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
};

describe('CreatePlanWizard', () => {
  beforeEach(() => vi.clearAllMocks());

  it('submits the form with the name, brief, and dates entered by the user', async () => {
    vi.mocked(contentPlanningApi.createPlan).mockResolvedValue({
      id: 'plan-1',
      name: 'Agosto',
      periodType: 'monthly',
      startDate: '2026-08-01',
      endDate: '2026-08-31',
      status: 'draft',
    });
    const onCreated = vi.fn();

    renderWithClient(<CreatePlanWizard onCreated={onCreated} />);

    fireEvent.change(screen.getByLabelText('Nombre del plan'), { target: { value: 'Agosto' } });
    fireEvent.change(screen.getByLabelText('Brief'), { target: { value: 'Lanzamiento' } });
    fireEvent.change(screen.getByLabelText('Desde'), { target: { value: '2026-08-01' } });
    fireEvent.change(screen.getByLabelText('Hasta'), { target: { value: '2026-08-31' } });
    fireEvent.click(screen.getByText('Crear plan'));

    await waitFor(() => expect(contentPlanningApi.createPlan).toHaveBeenCalled());
    expect(contentPlanningApi.createPlan).toHaveBeenCalledWith(
      'biz-1',
      expect.objectContaining({ name: 'Agosto', brief: 'Lanzamiento' }),
    );
  });

  it('includes the selected platform configs when submitting', async () => {
    vi.mocked(contentPlanningApi.createPlan).mockResolvedValue({
      id: 'plan-1',
      name: 'Agosto',
      periodType: 'monthly',
      startDate: '2026-08-01',
      endDate: '2026-08-31',
      status: 'draft',
    });

    renderWithClient(<CreatePlanWizard onCreated={vi.fn()} />);

    fireEvent.click(screen.getByLabelText(ContentPlanPlatform.INSTAGRAM));
    fireEvent.click(screen.getByText('Crear plan'));

    await waitFor(() => expect(contentPlanningApi.createPlan).toHaveBeenCalled());
    expect(contentPlanningApi.createPlan).toHaveBeenCalledWith(
      'biz-1',
      expect.objectContaining({
        platformConfigs: [{ platform: ContentPlanPlatform.INSTAGRAM, postsPerWeek: 1 }],
      }),
    );
  });
});
