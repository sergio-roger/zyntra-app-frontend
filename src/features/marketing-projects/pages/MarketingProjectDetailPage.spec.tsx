import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { MarketingProjectDetailPage } from '@features/marketing-projects/pages/MarketingProjectDetailPage';
import { marketingProjectsApi } from '@features/marketing-projects/api/marketing-projects.api';
import { MarketingProjectType } from '@features/marketing-projects/enums/marketing-project-type.enum';
import { MarketingProjectStatus } from '@features/marketing-projects/enums/marketing-project-status.enum';

vi.mock('@features/marketing-projects/api/marketing-projects.api', () => ({
  marketingProjectsApi: { getById: vi.fn(), getContentPlan: vi.fn() },
}));

vi.mock('@features/content-planning/api/content-planning.api', () => ({
  contentPlanningApi: { createPlan: vi.fn() },
}));

vi.mock('@features/auth/store/authStore', () => {
  const state = { user: { businessId: 'biz-1' } };
  const useAuthStore = (selector?: (s: typeof state) => unknown) =>
    selector ? selector(state) : state;
  return { useAuthStore };
});

const renderDetail = () => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={['/agents/projects/p1']}>
        <Routes>
          <Route path="/agents/projects/:id" element={<MarketingProjectDetailPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe('MarketingProjectDetailPage', () => {
  it('shows the CreatePlanWizard when a content_plan project has no plan yet', async () => {
    vi.mocked(marketingProjectsApi.getById).mockResolvedValue({
      id: 'p1',
      name: 'Café Aroma',
      description: null,
      type: MarketingProjectType.CONTENT_PLAN,
      status: MarketingProjectStatus.ACTIVE,
      coverImageUrl: null,
      kpiName: null,
      kpiCurrentValue: null,
      kpiTargetValue: null,
      roiPercent: null,
      progressPercent: 0,
      createdAt: '',
    });
    vi.mocked(marketingProjectsApi.getContentPlan).mockResolvedValue(null);

    renderDetail();

    expect(await screen.findByText('Crear plan')).toBeInTheDocument();
  });
});
