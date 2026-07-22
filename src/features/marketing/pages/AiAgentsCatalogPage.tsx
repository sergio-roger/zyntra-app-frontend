import { Loader2 } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { PageHeader } from '@shared/components/PageHeader';
import { AgentCard } from '../components/AgentCard';
import { CategoryTabs, StatusFilter } from '../components/CategoryTabs';
import {
  useImportAgent,
  useImportedAgents,
  useSystemAgentsCatalog,
} from '../hooks/use-agents-catalog';
import { AgentCategory, SystemAgentCatalogItem } from '../types/agents';

const uniqueCategories = (agents: SystemAgentCatalogItem[]): AgentCategory[] => {
  const byId = new Map<string, AgentCategory>();
  agents.forEach((agent) => {
    if (agent.category) byId.set(agent.category.id, agent.category);
  });
  return Array.from(byId.values());
};

const filterAgents = (
  agents: SystemAgentCatalogItem[],
  activeCategoryId: string | null,
  statusFilter: StatusFilter,
): SystemAgentCatalogItem[] =>
  agents.filter((agent) => {
    const matchesCategory =
      !activeCategoryId || agent.category?.id === activeCategoryId;
    const matchesStatus = statusFilter === 'all' || agent.status === statusFilter;
    return matchesCategory && matchesStatus;
  });

export const AiAgentsCatalogPage: React.FC = () => {
  const { data: agents, isLoading } = useSystemAgentsCatalog();
  const { data: importedAgents } = useImportedAgents();
  const importAgent = useImportAgent();
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const categories = useMemo(() => uniqueCategories(agents ?? []), [agents]);
  const visibleAgents = useMemo(
    () => filterAgents(agents ?? [], activeCategoryId, statusFilter),
    [agents, activeCategoryId, statusFilter],
  );
  const importedIds = useMemo(
    () => new Set((importedAgents ?? []).map((a) => a.id)),
    [importedAgents],
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title="AI Agents"
        subtitle="Tus agentes de IA trabajando para alcanzar tus objetivos."
      />

      <CategoryTabs
        categories={categories}
        activeCategoryId={activeCategoryId}
        onCategoryChange={setActiveCategoryId}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      {isLoading ? (
        <div className="flex justify-center p-20">
          <Loader2 className="animate-spin text-primary" size={48} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {visibleAgents.map((agent) => {
            const isImported = importedIds.has(agent.id);
            return (
              <AgentCard
                key={agent.id}
                agent={agent}
                primaryLabel={isImported ? 'Importado' : 'Importar'}
                primaryDisabled={agent.status !== 'active' || isImported}
                onPrimaryAction={() => importAgent.mutate(agent.id)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AiAgentsCatalogPage;
