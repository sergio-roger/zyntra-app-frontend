import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { ProjectCard } from '@features/marketing-projects/components/ProjectCard';
import { MarketingProjectType } from '@features/marketing-projects/enums/marketing-project-type.enum';
import { MarketingProjectStatus } from '@features/marketing-projects/enums/marketing-project-status.enum';

const renderCard = () => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <ProjectCard
          project={{
            id: 'p1',
            name: 'Inmobiliaria del Norte',
            description: 'Generar 200 leads calificados',
            type: MarketingProjectType.GENERAL,
            status: MarketingProjectStatus.ACTIVE,
            coverImageUrl: null,
            kpiName: 'Leads Generados',
            kpiCurrentValue: 128,
            kpiTargetValue: 200,
            roiPercent: 320,
            progressPercent: 65,
            createdAt: '2026-07-01T00:00:00.000Z',
          }}
        />
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe('ProjectCard', () => {
  it('shows the project name, status, KPI, and ROI', () => {
    renderCard();

    expect(screen.getByText('Inmobiliaria del Norte')).toBeInTheDocument();
    expect(screen.getByText('Activo')).toBeInTheDocument();
    expect(screen.getByText('Leads Generados')).toBeInTheDocument();
    expect(screen.getByText('128 / 200')).toBeInTheDocument();
    expect(screen.getByText('320%')).toBeInTheDocument();
  });
});
