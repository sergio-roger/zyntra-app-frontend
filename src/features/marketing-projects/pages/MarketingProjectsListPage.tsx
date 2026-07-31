import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { PageHeader } from '@shared/components/PageHeader';
import { Button } from '@core/ui/Button';
import { ProjectStatsBar } from '@features/marketing-projects/components/ProjectStatsBar';
import { ProjectStatusTabs } from '@features/marketing-projects/components/ProjectStatusTabs';
import { ProjectCard } from '@features/marketing-projects/components/ProjectCard';
import { useMarketingProjects } from '@features/marketing-projects/hooks/use-marketing-projects';
import { MarketingProjectStatus } from '@features/marketing-projects/enums/marketing-project-status.enum';

const PAGE_SIZE = 12;

export const MarketingProjectsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<MarketingProjectStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'recent' | 'name' | 'roi'>('recent');
  const [page, setPage] = useState(1);

  const params = useMemo(
    () => ({
      status: status === 'all' ? undefined : status,
      search: search || undefined,
      sort,
      page,
      limit: PAGE_SIZE,
    }),
    [status, search, sort, page],
  );

  const { data } = useMarketingProjects(params);
  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title="Marketing Projects"
        subtitle="Gestiona todos tus proyectos de marketing impulsados por IA."
        actions={
          <Button variant="primary" icon={Plus} onClick={() => navigate('/agents/projects/new')}>
            Nuevo Proyecto
          </Button>
        }
      />

      <ProjectStatsBar />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <ProjectStatusTabs
          value={status}
          onChange={(v) => {
            setStatus(v);
            setPage(1);
          }}
        />
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
            <input
              placeholder="Buscar proyectos..."
              className="input input-bordered input-sm pl-8 rounded-xl"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <select
            className="select select-bordered select-sm rounded-xl"
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
          >
            <option value="recent">Más recientes</option>
            <option value="name">Nombre A-Z</option>
            <option value="roi">ROI más alto</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {data?.items.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {data && data.total > 0 && (
        <div className="flex items-center justify-between text-sm text-base-content/50">
          <span>
            Mostrando {(page - 1) * PAGE_SIZE + 1} a {Math.min(page * PAGE_SIZE, data.total)} de {data.total} proyectos
          </span>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant="primary"
                outline={p !== page}
                size="sm"
                onClick={() => setPage(p)}
              >
                {p}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketingProjectsListPage;
