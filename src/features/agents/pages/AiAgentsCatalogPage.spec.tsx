import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { AiAgentsCatalogPage } from './AiAgentsCatalogPage';
import { agentsApi } from '../api/agents.api';
import { SystemAgentCatalogItem, WorkflowRun } from '../types/agents';

vi.mock('../api/agents.api', () => ({
  agentsApi: {
    getCatalog: vi.fn(),
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

const makeAgent = (
  overrides: Partial<SystemAgentCatalogItem>,
): SystemAgentCatalogItem => ({
  id: 'id',
  slug: 'slug',
  name: 'Name',
  role: 'role',
  description: 'desc',
  status: 'coming_soon',
  model: 'gemini-flash-lite-latest',
  createdAt: new Date().toISOString(),
  ...overrides,
});

const CATALOG: SystemAgentCatalogItem[] = [
  makeAgent({ id: '1', slug: 'marketing-strategist', name: 'Estratega', status: 'active' }),
  makeAgent({ id: '2', slug: 'content-creator', name: 'Creador de Contenido' }),
  makeAgent({ id: '3', slug: 'seo-specialist', name: 'Especialista SEO' }),
  makeAgent({ id: '4', slug: 'multimedia-designer', name: 'Diseñador Multimedia' }),
  makeAgent({ id: '5', slug: 'social-media-manager', name: 'Gestor de Redes' }),
  makeAgent({ id: '6', slug: 'crm-agent', name: 'Agente CRM' }),
  makeAgent({ id: '7', slug: 'automation-agent', name: 'Automatizador' }),
  makeAgent({ id: '8', slug: 'data-analyst', name: 'Analista de Datos' }),
];

const renderPage = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    React.createElement(
      QueryClientProvider,
      { client: queryClient },
      React.createElement(AiAgentsCatalogPage),
    ),
  );
};

describe('AiAgentsCatalogPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (agentsApi.getCatalog as ReturnType<typeof vi.fn>).mockResolvedValue(CATALOG);
  });

  it('renderiza las 8 tarjetas del catálogo con el badge correcto por status', async () => {
    renderPage();

    for (const agent of CATALOG) {
      expect(await screen.findByText(agent.name)).toBeInTheDocument();
    }

    expect(screen.getAllByText('Activo')).toHaveLength(1);
    expect(screen.getAllByText('Próximamente')).toHaveLength(7);
  });

  it('deshabilita "Ver Detalles" para los agentes coming_soon y lo habilita para el activo', async () => {
    renderPage();
    await screen.findByText('Estratega');

    const buttons = screen.getAllByRole('button', { name: 'Ver Detalles' });
    expect(buttons).toHaveLength(8);

    const activeIndex = CATALOG.findIndex((a) => a.status === 'active');
    buttons.forEach((btn, i) => {
      if (i === activeIndex) expect(btn).toBeEnabled();
      else expect(btn).toBeDisabled();
    });
  });

  it('dispara una corrida real al enviar el goal desde el modal del agente activo', async () => {
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
    await screen.findByText('Estratega');

    const buttons = screen.getAllByRole('button', { name: 'Ver Detalles' });
    fireEvent.click(buttons[CATALOG.findIndex((a) => a.status === 'active')]);

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
