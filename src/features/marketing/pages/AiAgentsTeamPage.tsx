import { Loader2, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { PageHeader } from '@shared/components/PageHeader';
import { AgentCard } from '@features/marketing/components/AgentCard';
import { AgentDetailModal } from '@features/marketing/components/AgentDetailModal';
import { AgentRunModal } from '@features/marketing/components/AgentRunModal';
import { useImportedAgents } from '@features/marketing/hooks/use-agents-catalog';
import { SystemAgentCatalogItem } from '@features/marketing/types/agents';

const EmptyTeamState: React.FC = () => (
  <div className="flex flex-col items-center gap-3 p-20 text-center text-base-content/60">
    <Users size={40} />
    <p>Todavía no importaste ningún agente a tu equipo.</p>
    <Link to="/agents/store" className="btn btn-primary btn-sm">
      Ir al Catálogo de Agentes
    </Link>
  </div>
);

export const AiAgentsTeamPage: React.FC = () => {
  const { data: importedAgents, isLoading } = useImportedAgents();
  const [runAgent, setRunAgent] = useState<SystemAgentCatalogItem | null>(null);
  const [detailAgent, setDetailAgent] = useState<SystemAgentCatalogItem | null>(
    null,
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title="Equipo de Agentes"
        subtitle="Los agentes de IA que importaste a tu negocio."
      />

      {isLoading ? (
        <div className="flex justify-center p-20">
          <Loader2 className="animate-spin text-primary" size={48} />
        </div>
      ) : (importedAgents ?? []).length === 0 ? (
        <EmptyTeamState />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(importedAgents ?? []).map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              primaryLabel="Ejecutar"
              primaryDisabled={false}
              onPrimaryAction={() => setRunAgent(agent)}
              onShowDetail={() => setDetailAgent(agent)}
              showStats
            />
          ))}
        </div>
      )}

      {runAgent && <AgentRunModal agent={runAgent} onClose={() => setRunAgent(null)} />}

      {detailAgent && (
        <AgentDetailModal
          agent={detailAgent}
          primaryLabel="Ejecutar"
          primaryDisabled={false}
          onPrimaryAction={() => {
            setRunAgent(detailAgent);
            setDetailAgent(null);
          }}
          onClose={() => setDetailAgent(null)}
          showStats
        />
      )}
    </div>
  );
};

export default AiAgentsTeamPage;
