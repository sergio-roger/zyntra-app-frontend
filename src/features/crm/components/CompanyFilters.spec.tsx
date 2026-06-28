import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { CompanyFilters } from '@crm/components/CompanyFilters';

vi.mock('@crm/hooks/useCompanies', () => ({
  useIndustrys: vi.fn().mockReturnValue({
    data: [
      { id: 'ind1', name: 'Tecnología' },
      { id: 'ind2', name: 'Finanzas' },
    ],
  }),
}));

vi.mock('@crm/hooks/useCrmMembers', () => ({
  useCrmMembers: vi.fn().mockReturnValue({
    data: [
      { id: 'u1', name: 'Carlos Mendoza' },
    ],
  }),
}));

vi.mock('@crm/hooks/useLifecycleStages', () => ({
  useLifecycleStages: vi.fn().mockReturnValue({
    data: [
      { id: 's1', name: 'Lead Prospecto' },
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

const defaultProps = {
  search: '',
  industryId: '',
  ownerId: '',
  lifecycleStageId: '',
  employeeRange: '',
  createdAtFrom: '',
  createdAtTo: '',
  customFieldConditions: [],
  onSearchChange: vi.fn(),
  onIndustryChange: vi.fn(),
  onOwnerChange: vi.fn(),
  onLifecycleStageChange: vi.fn(),
  onEmployeeRangeChange: vi.fn(),
  onDateRangeChange: vi.fn(),
  onOpenCustomFieldFilters: vi.fn(),
  onExportCsv: vi.fn(),
  onCustomizeColumns: vi.fn(),
  onReset: vi.fn(),
};

describe('CompanyFilters', () => {
  it('renders search input and trigger buttons', () => {
    render(<CompanyFilters {...defaultProps} />, { wrapper: createWrapper() });
    expect(screen.getByPlaceholderText('Buscar por nombre o identificación...')).toBeInTheDocument();
    expect(screen.getByText('Filtros avanzados')).toBeInTheDocument();
  });

  it('triggers onSearchChange when search text is entered', () => {
    const onSearchChange = vi.fn();
    render(<CompanyFilters {...defaultProps} onSearchChange={onSearchChange} />, {
      wrapper: createWrapper(),
    });

    const input = screen.getByPlaceholderText('Buscar por nombre o identificación...');
    fireEvent.change(input, { target: { value: 'Acme' } });

    expect(onSearchChange).toHaveBeenCalledWith('Acme');
  });

  it('renders select inputs and Otros campos button when advanced filters are opened', () => {
    render(<CompanyFilters {...defaultProps} />, { wrapper: createWrapper() });
    const advancedBtn = screen.getByText('Filtros avanzados');
    fireEvent.click(advancedBtn);
    expect(screen.getByText('Todas las industrias')).toBeInTheDocument();
    expect(screen.getByText('Todas las etapas')).toBeInTheDocument();
    expect(screen.getByText('Todos los empleados')).toBeInTheDocument();
    expect(screen.getByText('Otros campos')).toBeInTheDocument();
  });

  it('calls onExportCsv when export button is clicked', () => {
    const onExportCsv = vi.fn();
    render(<CompanyFilters {...defaultProps} onExportCsv={onExportCsv} />, {
      wrapper: createWrapper(),
    });

    const exportBtn = screen.getByText('Exportar CSV');
    fireEvent.click(exportBtn);

    expect(onExportCsv).toHaveBeenCalledTimes(1);
  });
});
