import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { ContactFilters } from '@crm/components/ContactFilters';

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('@crm/api/crm.api', () => ({
  crmApi: {
    listMembers: vi.fn().mockResolvedValue({
      data: [
        { id: 'u1', name: 'Ana García' },
        { id: 'u2', name: 'Beto Ruiz' },
      ],
    }),
  },
}));

vi.mock('@shared/api/axios', () => ({
  default: {
    get: vi.fn().mockResolvedValue({
      data: [
        {
          id: 's1',
          name: 'Nuevo lead',
          icon: '🟢',
          color: '#22c55e',
          type: 'active',
        },
        {
          id: 's2',
          name: 'Perdido',
          icon: '🔴',
          color: '#ef4444',
          type: 'lost',
        },
      ],
    }),
  },
}));

// ─── Helpers ──────────────────────────────────────────────────────────────────

const createWrapper = () => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  );
  return Wrapper;
};

const defaultProps = {
  search: '',
  source: '' as const,
  ownerId: '',
  lifecycleStageId: '',
  createdAtFrom: '',
  createdAtTo: '',
  lastActivityAtFrom: '',
  lastActivityAtTo: '',
  customFieldConditions: [],
  showOwnerFilter: false,
  onSearchChange: vi.fn(),
  onSourceChange: vi.fn(),
  onOwnerChange: vi.fn(),
  onLifecycleStageChange: vi.fn(),
  onDateRangeChange: vi.fn(),
  onLastActivityDateChange: vi.fn(),
  onOpenCustomFieldFilters: vi.fn(),
  onExportCsv: vi.fn(),
  onReset: vi.fn(),
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('ContactFilters', () => {
  beforeEach(() => vi.clearAllMocks());

  const openAdvancedFilters = () => {
    const advancedBtn = screen.getByRole('button', { name: /Filtros avanzados/i });
    fireEvent.click(advancedBtn);
  };

  it('renders the search input and source selector', () => {
    const Wrapper = createWrapper();
    render(
      <Wrapper>
        <ContactFilters {...defaultProps} />
      </Wrapper>,
    );

    expect(
      screen.getByPlaceholderText(/Buscar por nombre/i),
    ).toBeInTheDocument();
    openAdvancedFilters();
    expect(screen.getByText('Todos los orígenes')).toBeInTheDocument();
  });

  it('does NOT render the owner selector when showOwnerFilter is false', () => {
    const Wrapper = createWrapper();
    render(
      <Wrapper>
        <ContactFilters {...defaultProps} showOwnerFilter={false} />
      </Wrapper>,
    );

    openAdvancedFilters();
    expect(
      screen.queryByText('Todos los colaboradores'),
    ).not.toBeInTheDocument();
  });

  it('renders the owner selector when showOwnerFilter is true', () => {
    const Wrapper = createWrapper();
    render(
      <Wrapper>
        <ContactFilters {...defaultProps} showOwnerFilter={true} />
      </Wrapper>,
    );

    openAdvancedFilters();
    expect(screen.getByText('Todos los colaboradores')).toBeInTheDocument();
  });

  it('calls onSearchChange when the user types in the search box', () => {
    const onSearchChange = vi.fn();
    const Wrapper = createWrapper();
    render(
      <Wrapper>
        <ContactFilters {...defaultProps} onSearchChange={onSearchChange} />
      </Wrapper>,
    );

    fireEvent.change(screen.getByPlaceholderText(/Buscar por nombre/i), {
      target: { value: 'Juan' },
    });

    expect(onSearchChange).toHaveBeenCalledWith('Juan');
  });

  it('does NOT show the reset button when no filters are active', () => {
    const Wrapper = createWrapper();
    render(
      <Wrapper>
        <ContactFilters {...defaultProps} />
      </Wrapper>,
    );

    expect(screen.queryByText(/Limpiar filtros/i)).not.toBeInTheDocument();
  });

  it('shows the reset button and calls onReset when clicked', () => {
    const onReset = vi.fn();
    const Wrapper = createWrapper();
    render(
      <Wrapper>
        <ContactFilters {...defaultProps} search="test" onReset={onReset} />
      </Wrapper>,
    );

    const resetBtn = screen.getByRole('button', { name: /Limpiar filtros/i });
    expect(resetBtn).toBeInTheDocument();
    fireEvent.click(resetBtn);
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it('shows the reset button when ownerId filter is active', () => {
    const Wrapper = createWrapper();
    render(
      <Wrapper>
        <ContactFilters {...defaultProps} showOwnerFilter ownerId="u1" />
      </Wrapper>,
    );

    expect(screen.getByRole('button', { name: /Limpiar filtros/i })).toBeInTheDocument();
  });

  it('renders the lifecycle stage selector', () => {
    const Wrapper = createWrapper();
    render(
      <Wrapper>
        <ContactFilters {...defaultProps} />
      </Wrapper>,
    );

    openAdvancedFilters();
    expect(screen.getByText('Todos los ciclos')).toBeInTheDocument();
  });

  it('shows the reset button when lifecycleStageId filter is active', () => {
    const Wrapper = createWrapper();
    render(
      <Wrapper>
        <ContactFilters {...defaultProps} lifecycleStageId="s1" />
      </Wrapper>,
    );

    expect(screen.getByRole('button', { name: /Limpiar filtros/i })).toBeInTheDocument();
  });
});
