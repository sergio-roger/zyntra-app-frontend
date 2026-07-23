import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { MyBusinessPage } from '@features/settings/pages/MyBusinessPage';

const business = {
  id: 'business-1',
  name: 'Acme',
  email: 'contact@acme.com',
  phone: '+593 99 999 9999',
  address: 'Av. Siempre Viva 123',
  taxId: '1791234567001',
  website: 'https://acme.com',
  logoUrl: null,
  coverUrl: null,
  planStatus: 'trial' as const,
  createdAt: '2026-01-15T00:00:00.000Z',
};

vi.mock('@features/settings/hooks/useBusiness', () => ({
  useBusinessQuery: vi.fn(() => ({ data: business, isLoading: false })),
  useUploadBusinessLogo: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
  useRemoveBusinessLogo: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
  useUploadBusinessCover: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
  useRemoveBusinessCover: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
}));

vi.mock('@features/settings/components/BusinessFormDrawer', () => ({
  BusinessFormDrawer: ({ open }: { open: boolean }) => (
    <div data-testid="business-drawer">{open ? 'open' : 'closed'}</div>
  ),
}));

const createWrapper = () => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  );
  return Wrapper;
};

describe('MyBusinessPage', () => {
  it('muestra los datos de la business en modo lectura', () => {
    render(<MyBusinessPage />, { wrapper: createWrapper() });

    expect(screen.getByText('Acme')).toBeInTheDocument();
    expect(screen.getAllByText('contact@acme.com').length).toBeGreaterThan(0);
    expect(screen.getByText('1791234567001')).toBeInTheDocument();
  });

  it('muestra los detalles de la cuenta: identificador, fecha de alta y estado del plan', () => {
    render(<MyBusinessPage />, { wrapper: createWrapper() });

    expect(screen.getByText('business-1')).toBeInTheDocument();
    expect(screen.getByText(/enero.*2026/i)).toBeInTheDocument();
    expect(screen.getByText('Prueba')).toBeInTheDocument();
  });

  it('el drawer inicia cerrado y se abre al hacer click en "Editar empresa"', () => {
    render(<MyBusinessPage />, { wrapper: createWrapper() });

    expect(screen.getByTestId('business-drawer')).toHaveTextContent('closed');

    fireEvent.click(screen.getByRole('button', { name: /editar empresa/i }));

    expect(screen.getByTestId('business-drawer')).toHaveTextContent('open');
  });
});
