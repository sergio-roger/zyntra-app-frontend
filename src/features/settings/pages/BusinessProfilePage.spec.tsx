import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { BusinessProfilePage } from '@features/settings/pages/BusinessProfilePage';

const profile = {
  id: 'profile-1',
  businessId: 'business-1',
  industryId: null,
  nicheDetail: 'SaaS para agencias',
  valueProposition: 'Automatizamos marketing con IA',
  mission: '',
  competitors: ['Acme'],
  targetAudience: 'Agencias de marketing',
  audienceAgeRange: '25-34',
  businessModel: 'b2c' as const,
  geographicScope: 'local' as const,
  country: '',
  city: '',
  tone: 'friendly' as const,
  brandVoiceNotes: '',
  locale: 'es',
  brandColors: { primary: '', secondary: '', accent: '' },
  primaryGoal: 'leads' as const,
  monthlyBudgetRange: null,
  activeChannels: ['web_chat'],
  teamSize: null,
};

const updateProfileMutateAsync = vi.fn();

vi.mock('@features/settings/hooks/useBusinessProfile', () => ({
  useBusinessProfileQuery: vi.fn(() => ({ data: profile, isLoading: false })),
  useUpdateBusinessProfile: vi.fn(() => ({
    mutateAsync: updateProfileMutateAsync,
    isPending: false,
  })),
}));

vi.mock('@crm/hooks/useCompanies', () => ({
  useIndustrys: vi.fn(() => ({
    data: [{ id: 'industry-1', name: 'Tecnología' }],
    isLoading: false,
  })),
}));

vi.mock('@features/channels/hooks/channels.queries', () => ({
  useChannelsQuery: vi.fn(() => ({
    data: [
      {
        id: 'channel-1',
        channelType: { key: 'web_chat', label: 'Chat web' },
      },
    ],
  })),
}));

const createWrapper = () => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  );
  return Wrapper;
};

describe('BusinessProfilePage', () => {
  beforeEach(() => {
    updateProfileMutateAsync.mockReset();
  });

  it('muestra el tab "General" por defecto con los datos precargados', () => {
    render(<BusinessProfilePage />, { wrapper: createWrapper() });

    expect(screen.getByDisplayValue('SaaS para agencias')).toBeInTheDocument();
    expect(screen.getByText('Acme')).toBeInTheDocument();
  });

  it('cambia a la pestaña "Audiencia" y muestra sus campos', () => {
    render(<BusinessProfilePage />, { wrapper: createWrapper() });

    fireEvent.click(screen.getByRole('button', { name: 'Audiencia' }));

    expect(
      screen.getByDisplayValue('Agencias de marketing'),
    ).toBeInTheDocument();
    expect(screen.queryByDisplayValue('SaaS para agencias')).not.toBeInTheDocument();
  });

  it('cambia a la pestaña "Objetivos" y muestra los canales activos', () => {
    render(<BusinessProfilePage />, { wrapper: createWrapper() });

    fireEvent.click(screen.getByRole('button', { name: 'Objetivos' }));

    expect(screen.getByRole('button', { name: 'Chat web' })).toBeInTheDocument();
  });

  it('envía solo los campos modificados al guardar', async () => {
    render(<BusinessProfilePage />, { wrapper: createWrapper() });

    fireEvent.change(screen.getByDisplayValue('SaaS para agencias'), {
      target: { value: 'SaaS para pymes' },
    });
    fireEvent.click(screen.getByRole('button', { name: /guardar cambios/i }));

    await waitFor(() => {
      expect(updateProfileMutateAsync).toHaveBeenCalledWith({
        nicheDetail: 'SaaS para pymes',
      });
    });
  });

  it('no llama a la mutación si no hay cambios', async () => {
    render(<BusinessProfilePage />, { wrapper: createWrapper() });

    fireEvent.click(screen.getByRole('button', { name: /guardar cambios/i }));

    await waitFor(() => {
      expect(updateProfileMutateAsync).not.toHaveBeenCalled();
    });
  });
});
