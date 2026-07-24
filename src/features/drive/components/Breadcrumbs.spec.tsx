import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { Breadcrumbs } from '@features/drive/components/Breadcrumbs';

vi.mock('@features/drive/hooks/use-drive-folders', () => ({
  useDriveBreadcrumb: vi.fn().mockReturnValue({
    data: [
      { id: 'root-1', name: 'Raíz' },
      { id: 'sub-1', name: 'Contratos' },
    ],
  }),
}));

const createWrapper = () => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  );
  return Wrapper;
};

describe('Breadcrumbs', () => {
  it('renders the ancestor chain plus the home button', () => {
    render(<Breadcrumbs folderId="sub-1" onNavigate={vi.fn()} />, {
      wrapper: createWrapper(),
    });
    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.getByText('Raíz')).toBeInTheDocument();
    expect(screen.getByText('Contratos')).toBeInTheDocument();
  });

  it('navigates to root when Inicio is clicked', () => {
    const onNavigate = vi.fn();
    render(<Breadcrumbs folderId="sub-1" onNavigate={onNavigate} />, {
      wrapper: createWrapper(),
    });
    fireEvent.click(screen.getByText('Inicio'));
    expect(onNavigate).toHaveBeenCalledWith(undefined);
  });

  it('navigates to an intermediate crumb when clicked', () => {
    const onNavigate = vi.fn();
    render(<Breadcrumbs folderId="sub-1" onNavigate={onNavigate} />, {
      wrapper: createWrapper(),
    });
    fireEvent.click(screen.getByText('Raíz'));
    expect(onNavigate).toHaveBeenCalledWith('root-1');
  });

  it('disables the last crumb (current folder)', () => {
    render(<Breadcrumbs folderId="sub-1" onNavigate={vi.fn()} />, {
      wrapper: createWrapper(),
    });
    expect(screen.getByText('Contratos')).toBeDisabled();
  });
});
