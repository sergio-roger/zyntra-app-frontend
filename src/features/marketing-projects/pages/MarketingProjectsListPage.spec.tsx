import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { MarketingProjectsListPage } from '@features/marketing-projects/pages/MarketingProjectsListPage';
import { marketingProjectsApi } from '@features/marketing-projects/api/marketing-projects.api';
import { MarketingProjectType } from '@features/marketing-projects/enums/marketing-project-type.enum';
import { MarketingProjectStatus } from '@features/marketing-projects/enums/marketing-project-status.enum';

vi.mock('@features/marketing-projects/api/marketing-projects.api', () => ({
  marketingProjectsApi: { list: vi.fn(), getStats: vi.fn() },
}));

vi.mock('@features/auth/store/authStore', () => {
  const state = { user: { businessId: 'biz-1' } };
  const useAuthStore = (selector?: (s: typeof state) => unknown) =>
    selector ? selector(state) : state;
  return { useAuthStore };
});

const renderPage = () => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <MarketingProjectsListPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe('MarketingProjectsListPage', () => {
  it('lists projects and re-fetches with the search term', async () => {
    vi.mocked(marketingProjectsApi.getStats).mockResolvedValue({ active: 0, paused: 0, completed: 0, avgRoi: 0 });
    vi.mocked(marketingProjectsApi.list).mockResolvedValue({
      items: [
        {
          id: 'p1',
          name: 'Café Aroma',
          description: null,
          type: MarketingProjectType.GENERAL,
          status: MarketingProjectStatus.ACTIVE,
          coverImageUrl: null,
          kpiName: null,
          kpiCurrentValue: null,
          kpiTargetValue: null,
          roiPercent: null,
          progressPercent: 40,
          createdAt: '2026-07-01T00:00:00.000Z',
        },
      ],
      total: 1,
    });

    renderPage();

    expect(await screen.findByText('Café Aroma')).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText('Buscar proyectos...'), { target: { value: 'Café' } });

    await waitFor(() =>
      expect(marketingProjectsApi.list).toHaveBeenCalledWith(
        'biz-1',
        expect.objectContaining({ search: 'Café' }),
      ),
    );
  });
});
