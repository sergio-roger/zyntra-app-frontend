import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Loader2, Plus, Share2, Trash2, Zap } from 'lucide-react';
import { useAuthStore } from '@features/auth/store/authStore';
import { ConfirmModal } from '@shared/components/ConfirmModal';
import { EmptyState } from '@shared/components/EmptyState';
import { useAgentsList, useDeleteAgent } from '../hooks/use-agents';
import { useAgentKnowledgeDocuments } from '../hooks/use-agent-knowledge';
import { useChannelsList } from '../hooks/use-agent-channel';
import { Agent, KnowledgeDocumentStatus } from '../types/automations';

const formatDate = (iso: string) => new Date(iso).toLocaleDateString('es-EC');

const StatusBadge: React.FC<{ isActive: boolean }> = ({ isActive }) =>
  isActive ? (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      Activo
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-slate-800 text-slate-500">
      <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
      Inactivo
    </span>
  );

const ReadyDocsCount: React.FC<{ agentId: string }> = ({ agentId }) => {
  const { data: documents, isLoading } = useAgentKnowledgeDocuments(agentId);
  if (isLoading) return <Loader2 size={13} className="animate-spin text-slate-500" />;
  const readyCount =
    documents?.filter((d) => d.status === KnowledgeDocumentStatus.READY).length ?? 0;
  return <span className="text-slate-300">{readyCount}</span>;
};

const AssignedChannelCell: React.FC<{ agent: Agent }> = ({ agent }) => {
  const { data: channels } = useChannelsList();
  const assigned = channels?.filter((c) => c.agentId === agent.id) ?? [];
  if (assigned.length === 0) {
    return <span className="text-slate-600">Sin asignar</span>;
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-slate-300">
      <Share2 size={12} className="text-slate-500" />
      {assigned.map((c) => c.name).join(', ')}
    </span>
  );
};

export const AgentsListPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { data: agents = [], isLoading } = useAgentsList();
  const deleteAgent = useDeleteAgent();

  const [agentToDelete, setAgentToDelete] = useState<Agent | null>(null);

  const limit = user?.plan?.aiAgentLimit ?? 0;
  const isUnlimited = limit >= 999999;
  const isLimitReached = !isUnlimited && agents.length >= limit;

  const handleConfirmDelete = async () => {
    if (agentToDelete) {
      await deleteAgent.mutateAsync(agentToDelete.id);
      setAgentToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex w-full items-center justify-center py-24">
        <Loader2 size={24} className="animate-spin text-slate-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white tracking-tight">Agentes</h2>
          <p className="text-sm text-slate-400">
            Configura agentes de IA para responder conversaciones automáticamente.
          </p>
          <div className="text-xs font-semibold text-slate-500">
            <span
              className={isLimitReached ? 'text-rose-400 font-bold' : 'text-slate-300'}
            >
              {agents.length}
            </span>{' '}
            / {isUnlimited ? '∞' : limit} agentes
          </div>
        </div>
        <button
          onClick={() => navigate('/automations/agents/new')}
          disabled={isLimitReached}
          className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold shadow-lg transition-all ${
            isLimitReached
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed shadow-none'
              : 'bg-primary text-white shadow-primary/20 hover:-translate-y-px hover:shadow-xl active:scale-95'
          }`}
        >
          <Plus size={18} /> Crear agente
        </button>
      </div>

      {isLimitReached && (
        <div className="flex items-center gap-3 rounded-2xl border border-warning/20 bg-warning/10 p-4 text-sm">
          <Zap size={16} className="shrink-0 text-warning" />
          <span className="text-slate-300">
            Alcanzaste el límite de agentes de tu plan. Actualiza tu plan para crear más.
          </span>
          <button
            onClick={() => navigate('/billing')}
            className="ml-auto shrink-0 btn btn-warning btn-xs"
          >
            Ver planes
          </button>
        </div>
      )}

      {agents.length === 0 ? (
        <EmptyState
          icon={Bot}
          title="Todavía no tenés agentes"
          description="Creá tu primer agente de IA para responder conversaciones automáticamente."
          actionLabel={isLimitReached ? undefined : 'Crear agente'}
          onAction={isLimitReached ? undefined : () => navigate('/automations/agents/new')}
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/10 bg-slate-900/50">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="border-b border-white/10 bg-slate-900/80 text-xs text-slate-400 uppercase">
              <tr>
                <th className="px-4 py-3 font-semibold">Nombre</th>
                <th className="px-4 py-3 font-semibold">Canal asignado</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3 font-semibold">Modelo</th>
                <th className="px-4 py-3 font-semibold">Documentos listos</th>
                <th className="px-4 py-3 font-semibold">Creado</th>
                <th className="px-4 py-3 font-semibold" />
              </tr>
            </thead>
            <tbody>
              {agents.map((agent) => (
                <tr
                  key={agent.id}
                  className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] cursor-pointer transition-colors"
                  onClick={() => navigate(`/automations/agents/${agent.id}`)}
                >
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-2 font-medium text-slate-100">
                      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                        <Bot size={13} />
                      </span>
                      {agent.name}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <AssignedChannelCell agent={agent} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge isActive={agent.isActive} />
                  </td>
                  <td className="px-4 py-3 text-slate-300">{agent.model}</td>
                  <td className="px-4 py-3">
                    <ReadyDocsCount agentId={agent.id} />
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    {formatDate(agent.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setAgentToDelete(agent);
                      }}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
                      aria-label={`Eliminar ${agent.name}`}
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        isOpen={agentToDelete !== null}
        onClose={() => setAgentToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Eliminar agente"
        description={`¿Estás seguro de eliminar el agente "${agentToDelete?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        variant="danger"
      />
    </div>
  );
};

export default AgentsListPage;
