import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import { AiAgentsTeamPage } from './AiAgentsTeamPage';
import { agentsApi } from '../api/agents.api';
import { ImportedSystemAgent, WorkflowRun } from '../types/agents';

vi.mock('../api/agents.api', () => ({
  agentsApi: {
    getCatalog: vi.fn(),
    getImportedAgents: vi.fn(),
    importAgent: vi.fn(),
    triggerRun: vi.fn(),
    getRun: vi.fn(),
  },
}));

vi.mock('@features/auth/store/authStore', () => {
  const state = { user: { businessId: 'biz-1' } };
  const useAuthStore = (selector?: (s: typeof state) => unknown) =>
    selector ? selector(state) : state;
  return { useAuthStore };
});

const IMPORTED_AGENT: ImportedSystemAgent = {
  id: '1',
  slug: 'marketing-strategist',
  name: 'Estratega',
  role: 'marketing_strategist',
  description: 'desc',
  status: 'active',
  model: 'gemini-flash-lite-latest',
  category: { id: 'cat-1', slug: 'estrategia', name: 'Estrategia', color: '#7c3aed' },
  tasksDoneToday: 4,
  tasksTotalToday: 4,
  efficiency: 98,
  createdAt: new Date().toISOString(),
  importedAt: new Date().toISOString(),
};

const renderPage = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    React.createElement(
      QueryClientProvider,
      { client: queryClient },
      React.createElement(MemoryRouter, null, React.createElement(AiAgentsTeamPage)),
    ),
  );
};

describe('AiAgentsTeamPage', () => {
  beforeEach(() => vi.clearAllMocks());

  it('muestra el empty state cuando no hay agentes importados', async () => {
    (agentsApi.getImportedAgents as ReturnType<typeof vi.fn>).mockResolvedValue([]);

    renderPage();

    expect(
      await screen.findByText('Todavía no importaste ningún agente a tu equipo.'),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ir a la Tienda de Agentes' })).toBeInTheDocument();
  });

  it('renderiza los agentes importados con botón "Ver Detalles"', async () => {
    (agentsApi.getImportedAgents as ReturnType<typeof vi.fn>).mockResolvedValue([
      IMPORTED_AGENT,
    ]);

    renderPage();

    expect(await screen.findByText('Estratega')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ver Detalles' })).toBeEnabled();
  });

  it('abre el AgentRunModal y dispara una corrida al hacer click en "Ver Detalles"', async () => {
    (agentsApi.getImportedAgents as ReturnType<typeof vi.fn>).mockResolvedValue([
      IMPORTED_AGENT,
    ]);
    const pendingRun: WorkflowRun = {
      id: 'run-1',
      businessId: 'biz-1',
      goal: 'mi objetivo',
      status: 'completed',
      steps: [
        {
          step: 'execute-plan',
          output: { results: [{ output: 'Estrategia generada de prueba' }] },
        },
      ],
      errorMessage: null,
      startedAt: null,
      finishedAt: null,
      createdAt: '',
      updatedAt: '',
    };
    (agentsApi.triggerRun as ReturnType<typeof vi.fn>).mockResolvedValue(pendingRun);
    (agentsApi.getRun as ReturnType<typeof vi.fn>).mockResolvedValue(pendingRun);

    renderPage();
    fireEvent.click(await screen.findByRole('button', { name: 'Ver Detalles' }));

    const textarea = await screen.findByPlaceholderText(
      /Lanzar una campaña de captación de leads B2B/,
    );
    fireEvent.change(textarea, { target: { value: 'mi objetivo' } });
    fireEvent.click(screen.getByRole('button', { name: /Generar estrategia/ }));

    await waitFor(() =>
      expect(agentsApi.triggerRun).toHaveBeenCalledWith('biz-1', 'mi objetivo'),
    );
    expect(await screen.findByText('Estrategia generada de prueba')).toBeInTheDocument();
  });
});
