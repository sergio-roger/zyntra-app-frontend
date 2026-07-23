import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { BusinessFormDrawer } from '@features/settings/components/BusinessFormDrawer';

const business = {
  id: 'business-1',
  name: 'Acme',
  email: 'contact@acme.com',
  phone: '+593 99 999 9999',
  address: 'Av. Siempre Viva 123',
  taxId: '1791234567001',
  website: 'https://acme.com',
  logoUrl: null,
  planStatus: 'trial' as const,
  createdAt: '2026-01-15T00:00:00.000Z',
};

const updateBusinessMutateAsync = vi.fn();
const onClose = vi.fn();

vi.mock('@features/settings/hooks/useBusiness', () => ({
  useUpdateBusiness: vi.fn(() => ({
    mutateAsync: updateBusinessMutateAsync,
    isPending: false,
  })),
}));

const createWrapper = () => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  );
  return Wrapper;
};

describe('BusinessFormDrawer', () => {
  beforeEach(() => {
    updateBusinessMutateAsync.mockReset();
    onClose.mockReset();
  });

  it('precarga el formulario con los datos de la business', () => {
    render(
      <BusinessFormDrawer open business={business} onClose={onClose} />,
      { wrapper: createWrapper() },
    );

    expect(screen.getByDisplayValue('Acme')).toBeInTheDocument();
    expect(screen.getByDisplayValue('1791234567001')).toBeInTheDocument();
  });

  it('solo envía los campos modificados y cierra el drawer', async () => {
    render(
      <BusinessFormDrawer open business={business} onClose={onClose} />,
      { wrapper: createWrapper() },
    );

    fireEvent.change(screen.getByLabelText('Nombre de la empresa'), {
      target: { value: 'Acme Renamed' },
    });
    fireEvent.click(screen.getByRole('button', { name: /guardar cambios/i }));

    await waitFor(() => {
      expect(updateBusinessMutateAsync).toHaveBeenCalledWith({
        name: 'Acme Renamed',
      });
      expect(onClose).toHaveBeenCalled();
    });
  });

  it('cierra sin llamar a la mutación si no hay cambios', async () => {
    render(
      <BusinessFormDrawer open business={business} onClose={onClose} />,
      { wrapper: createWrapper() },
    );

    fireEvent.click(screen.getByRole('button', { name: /guardar cambios/i }));

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
    expect(updateBusinessMutateAsync).not.toHaveBeenCalled();
  });

  it('el botón cancelar cierra el drawer sin enviar cambios', () => {
    render(
      <BusinessFormDrawer open business={business} onClose={onClose} />,
      { wrapper: createWrapper() },
    );

    fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));

    expect(onClose).toHaveBeenCalled();
    expect(updateBusinessMutateAsync).not.toHaveBeenCalled();
  });
});
