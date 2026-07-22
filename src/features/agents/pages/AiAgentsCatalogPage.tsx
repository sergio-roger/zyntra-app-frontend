import {
  Bot,
  CheckCircle2,
  Clock,
  Loader2,
  Megaphone,
  Palette,
  PenSquare,
  Plus,
  Search,
  Share2,
  TrendingUp,
  Users,
  XCircle,
} from 'lucide-react';
import React, { useState } from 'react';
import { PageHeader } from '@shared/components/PageHeader';
import {
  useOrchestratorRun,
  useSystemAgentsCatalog,
  useTriggerOrchestratorRun,
} from '../hooks/use-agents-catalog';
import { SystemAgentCatalogItem } from '../types/agents';

const SLUG_ICONS: Record<string, React.ElementType> = {
  'marketing-strategist': TrendingUp,
  'content-creator': PenSquare,
  'seo-specialist': Search,
  'multimedia-designer': Palette,
  'social-media-manager': Share2,
  'crm-agent': Users,
  'automation-agent': Bot,
  'data-analyst': Megaphone,
};

export const AiAgentsCatalogPage: React.FC = () => {
  const { data: agents, isLoading } = useSystemAgentsCatalog();
  const [selectedAgent, setSelectedAgent] =
    useState<SystemAgentCatalogItem | null>(null);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title="AI Agents"
        subtitle="Tus agentes de IA trabajando para alcanzar tus objetivos."
      />

      {isLoading ? (
        <div className="flex justify-center p-20">
          <Loader2 className="animate-spin text-primary" size={48} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(agents ?? []).map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onOpen={() => setSelectedAgent(agent)}
            />
          ))}
        </div>
      )}

      {selectedAgent && (
        <AgentRunModal
          agent={selectedAgent}
          onClose={() => setSelectedAgent(null)}
        />
      )}
    </div>
  );
};

const AgentCard: React.FC<{
  agent: SystemAgentCatalogItem;
  onOpen: () => void;
}> = ({ agent, onOpen }) => {
  const Icon = SLUG_ICONS[agent.slug] ?? Bot;
  const isActive = agent.status === 'active';

  return (
    <div className="card bg-base-100 shadow-sm border border-base-200 hover:shadow-md transition-shadow">
      <div className="card-body gap-3">
        <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
          <Icon size={24} />
        </div>
        <h3 className="font-bold text-lg leading-tight">{agent.name}</h3>
        <p className="text-sm text-base-content/60 flex-1">
          {agent.description}
        </p>
        <div>
          {isActive ? (
            <span className="badge badge-success gap-1">
              <CheckCircle2 size={12} /> Activo
            </span>
          ) : (
            <span className="badge badge-ghost gap-1">
              <Clock size={12} /> Próximamente
            </span>
          )}
        </div>
        <button
          onClick={onOpen}
          disabled={!isActive}
          className="btn btn-primary btn-sm mt-2"
        >
          Ver Detalles
        </button>
      </div>
    </div>
  );
};

const AgentRunModal: React.FC<{
  agent: SystemAgentCatalogItem;
  onClose: () => void;
}> = ({ agent, onClose }) => {
  const [goal, setGoal] = useState('');
  const [runId, setRunId] = useState<string | null>(null);
  const triggerRun = useTriggerOrchestratorRun();
  const { data: run } = useOrchestratorRun(runId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await triggerRun.mutateAsync(goal);
    setRunId(result.id);
  };

  const strategyResult = run?.steps
    ?.find((s) => s.step === 'execute-plan')
    ?.output as { results?: { output: string }[] } | undefined;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="font-bold text-xl">{agent.name}</h3>
            <p className="text-sm opacity-60">{agent.description}</p>
          </div>
          <button
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost text-xl"
          >
            ✕
          </button>
        </div>

        {!runId && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">
                  ¿Qué objetivo querés lograr?
                </span>
              </label>
              <textarea
                className="textarea textarea-bordered h-24"
                placeholder="Ej: Lanzar una campaña de captación de leads B2B"
                required
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
              />
            </div>
            <div className="modal-action">
              <button
                type="submit"
                disabled={triggerRun.isPending}
                className="btn btn-primary gap-2"
              >
                {triggerRun.isPending ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Plus size={18} />
                )}
                Generar estrategia
              </button>
            </div>
          </form>
        )}

        {runId && (
          <div>
            {(!run || run.status === 'pending' || run.status === 'running') && (
              <div className="flex items-center gap-3 text-base-content/60 py-8 justify-center">
                <Loader2 className="animate-spin" size={20} />
                Generando estrategia...
              </div>
            )}

            {run?.status === 'failed' && (
              <div className="alert alert-error">
                <XCircle size={18} />
                <span>{run.errorMessage ?? 'Ocurrió un error.'}</span>
              </div>
            )}

            {run?.status === 'completed' && (
              <div className="prose max-w-none bg-base-200/50 p-6 rounded-xl border border-base-300 overflow-auto max-h-96">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                  {strategyResult?.results?.[0]?.output ??
                    'No se generó ningún resultado.'}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AiAgentsCatalogPage;
