import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { CreateMarketingProjectPage } from '@features/marketing-projects/pages/CreateMarketingProjectPage';
import { marketingProjectsApi } from '@features/marketing-projects/api/marketing-projects.api';
import { MarketingProjectType } from '@features/marketing-projects/enums/marketing-project-type.enum';
import { MarketingProjectStatus } from '@features/marketing-projects/enums/marketing-project-status.enum';

vi.mock('@features/marketing-projects/api/marketing-projects.api', () => ({
  marketingProjectsApi: { create: vi.fn(), uploadCover: vi.fn(), generateCover: vi.fn(), updateMembers: vi.fn() },
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

vi.mock('@shared/api/axios', () => ({ default: { get: vi.fn().mockResolvedValue({ data: [] }) } }));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

describe('CreateMarketingProjectPage', () => {
  beforeEach(() => vi.clearAllMocks());

  it('creates a general project and navigates to its detail', async () => {
    vi.mocked(marketingProjectsApi.create).mockResolvedValue({
      id: 'p1',
      name: 'Inmobiliaria del Norte',
      description: null,
      type: MarketingProjectType.GENERAL,
      status: MarketingProjectStatus.DRAFT,
      coverImageUrl: null,
      kpiName: null,
      kpiCurrentValue: null,
      kpiTargetValue: null,
      roiPercent: null,
      progressPercent: null,
      createdAt: '',
    });

    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(
      <QueryClientProvider client={qc}>
        <MemoryRouter>
          <CreateMarketingProjectPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Inmobiliaria del Norte' } });
    fireEvent.click(screen.getByText('Crear proyecto'));

    await waitFor(() => expect(marketingProjectsApi.create).toHaveBeenCalled());
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/agents/projects/p1'));
  });
});
