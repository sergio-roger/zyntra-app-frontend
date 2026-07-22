import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { AiAgentsCatalogPage } from './AiAgentsCatalogPage';
import { agentsApi } from '../api/agents.api';
import { AgentCategory, SystemAgentCatalogItem } from '../types/agents';

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

const ESTRATEGIA: AgentCategory = {
  id: 'cat-estrategia',
  slug: 'estrategia',
  name: 'Estrategia',
  color: '#7c3aed',
};
const CONTENIDO: AgentCategory = {
  id: 'cat-contenido',
  slug: 'contenido',
  name: 'Contenido',
  color: '#16a34a',
};

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
  category: CONTENIDO,
  tasksDoneToday: 0,
  tasksTotalToday: 0,
  efficiency: 0,
  createdAt: new Date().toISOString(),
  ...overrides,
});

const CATALOG: SystemAgentCatalogItem[] = [
  makeAgent({
    id: '1',
    slug: 'marketing-strategist',
    name: 'Estratega',
    status: 'active',
    category: ESTRATEGIA,
  }),
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
    (agentsApi.getImportedAgents as ReturnType<typeof vi.fn>).mockResolvedValue([]);
  });

  it('renderiza las 8 tarjetas del catálogo con el badge correcto por status', async () => {
    renderPage();

    for (const agent of CATALOG) {
      expect(await screen.findByText(agent.name)).toBeInTheDocument();
    }

    const statusLabels = screen.getAllByText(
      (_, element) =>
        element?.tagName === 'SPAN' &&
        (element.textContent === 'Activo' || element.textContent === 'Próximamente'),
    );
    const activeLabels = statusLabels.filter((el) => el.textContent === 'Activo');
    const comingSoonLabels = statusLabels.filter(
      (el) => el.textContent === 'Próximamente',
    );
    expect(activeLabels).toHaveLength(1);
    expect(comingSoonLabels).toHaveLength(7);
  });

  it('deshabilita "Importar" para los agentes coming_soon y lo habilita para el activo', async () => {
    renderPage();
    await screen.findByText('Estratega');

    const buttons = screen.getAllByRole('button', { name: 'Importar' });
    expect(buttons).toHaveLength(8);

    const activeIndex = CATALOG.findIndex((a) => a.status === 'active');
    buttons.forEach((btn, i) => {
      if (i === activeIndex) expect(btn).toBeEnabled();
      else expect(btn).toBeDisabled();
    });
  });

  it('importa el agente activo y refleja el estado "Importado"', async () => {
    (agentsApi.importAgent as ReturnType<typeof vi.fn>).mockResolvedValue({
      ...CATALOG[0],
      importedAt: new Date().toISOString(),
    });

    renderPage();
    await screen.findByText('Estratega');

    const activeIndex = CATALOG.findIndex((a) => a.status === 'active');
    fireEvent.click(screen.getAllByRole('button', { name: 'Importar' })[activeIndex]);

    await waitFor(() =>
      expect(agentsApi.importAgent).toHaveBeenCalledWith('biz-1', CATALOG[0].id),
    );
  });

  it('filtra por tab de categoría', async () => {
    renderPage();
    await screen.findByText('Estratega');

    fireEvent.click(screen.getByRole('tab', { name: 'Estrategia' }));

    expect(screen.getByText('Estratega')).toBeInTheDocument();
    expect(screen.queryByText('Creador de Contenido')).not.toBeInTheDocument();
  });

  it('filtra por Estado', async () => {
    renderPage();
    await screen.findByText('Estratega');

    fireEvent.click(screen.getByText('Estado: Todos'));
    fireEvent.click(screen.getByRole('button', { name: 'Activo' }));

    expect(screen.getByText('Estratega')).toBeInTheDocument();
    expect(screen.queryByText('Creador de Contenido')).not.toBeInTheDocument();
  });
});
