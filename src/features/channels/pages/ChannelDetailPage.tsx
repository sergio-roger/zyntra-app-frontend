import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  Bot,
  Code2,
  Loader2,
  Trash2,
  X,
} from 'lucide-react';
import {
  useChannelQuery,
  useUpdateChannelMutation,
  useDeactivateChannelMutation,
  useRemoveChannelMutation,
  useAssignAgentMutation,
  useUnassignAgentMutation,
} from '../hooks/channels.queries';
import { useAiAgents } from '@features/ai-agents/hooks/useAiAgents';
import { CopyButton } from '@features/channels/components/CopyButton';
import { SectionHeading } from '@features/channels/components/SectionHeading';
import { ConfirmModal } from '@shared/components/ConfirmModal';
import { PageHeader } from '@shared/components/PageHeader';

export const ChannelDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { channelId = '' } = useParams<{ channelId: string }>();
  const { data: channel, isLoading, isError } = useChannelQuery(channelId);
  const { data: agents = [] } = useAiAgents();

  const { mutateAsync: deactivateChannel, isPending: saving } =
    useDeactivateChannelMutation();
  const { mutateAsync: updateChannel } = useUpdateChannelMutation(channelId);
  const { mutateAsync: removeChannel, isPending: deleting } =
    useRemoveChannelMutation();
  const { mutateAsync: assignAgent, isPending: assigning } =
    useAssignAgentMutation(channelId);
  const { mutateAsync: unassignAgent, isPending: unassigning } =
    useUnassignAgentMutation(channelId);

  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState('');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (isError || !channel) {
    return (
      <div className="alert alert-error max-w-lg mx-auto mt-8">
        <AlertCircle size={18} />
        <span>No se pudo cargar el canal.</span>
      </div>
    );
  }

  const handleToggleStatus = async () => {
    try {
      if (channel.status === 'active') {
        await deactivateChannel(channelId);
      } else {
        await updateChannel({ status: 'active' });
      }
    } catch {
      setError('Error al actualizar el estado.');
    }
  };

  const handleAssign = async () => {
    if (!selectedAgent) return;
    try {
      await assignAgent(selectedAgent);
      setSelectedAgent('');
    } catch {
      setError('Error al asignar el agente.');
    }
  };

  const handleUnassign = async () => {
    try {
      await unassignAgent();
    } catch {
      setError('Error al desasignar el agente.');
    }
  };

  const handleDelete = async () => {
    try {
      await removeChannel(channelId);
      navigate('/settings/channels');
    } catch {
      setError('No se puede eliminar el canal.');
    } finally {
      setConfirmDelete(false);
    }
  };

  const assignedAgent = agents.find((a) => a.id === channel.agentId);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <button
        className="btn btn-ghost btn-sm gap-1 -mb-2 w-fit"
        onClick={() => navigate('/settings/channels')}
      >
        <ArrowLeft size={14} /> Canal Store
      </button>

      <PageHeader
        title={channel.name}
        subtitle={channel.channelType?.label ?? 'Canal'}
        badge={
          <span
            className={`badge ${channel.status === 'active' ? 'badge-success' : 'badge-ghost'}`}
          >
            {channel.status === 'active' ? 'Activo' : 'Inactivo'}
          </span>
        }
        actions={
          <button
            className="btn btn-ghost btn-sm"
            onClick={handleToggleStatus}
            disabled={saving}
          >
            {channel.status === 'active' ? 'Desactivar' : 'Activar'}
          </button>
        }
      />

      {error && (
        <div className="alert alert-error text-sm">
          <AlertCircle size={16} /> <span>{error}</span>
          <button className="btn btn-ghost btn-xs" onClick={() => setError('')}>
            <X size={12} />
          </button>
        </div>
      )}

      {/* Embed code */}
      {channel.embedCode && (
        <div className="card bg-base-100 border border-base-300 shadow-sm">
          <div className="card-body gap-4 p-6">
            <div className="flex items-center justify-between">
              <SectionHeading icon={Code2} label="Código de integración" />
              <CopyButton text={channel.embedCode} />
            </div>
            <pre className="text-xs font-mono bg-base-200 rounded-xl p-4 whitespace-pre-wrap break-all overflow-x-auto">
              {channel.embedCode}
            </pre>
            <p className="text-xs text-base-content/50">
              Inserta este código antes del cierre de <code>&lt;/body&gt;</code>{' '}
              en tu sitio web.
            </p>
          </div>
        </div>
      )}

      {/* Agent assignment */}
      <div className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="card-body gap-5 p-6">
          <SectionHeading icon={Bot} label="Agente de IA" />

          {assignedAgent ? (
            <div className="flex items-center justify-between bg-base-200 rounded-xl p-4">
              <div>
                <p className="font-medium text-sm">{assignedAgent.name}</p>
                <p className="text-xs text-base-content/50">
                  {assignedAgent.model}
                </p>
              </div>
              <button
                className="btn btn-ghost btn-sm text-error"
                onClick={handleUnassign}
                disabled={unassigning}
              >
                {unassigning ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <X size={14} />
                )}
                Desasignar
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <select
                className="select select-bordered select-sm flex-1"
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
              >
                <option value="">Seleccionar agente...</option>
                {agents
                  .filter((a) => a.isActive)
                  .map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
              </select>
              <button
                className="btn btn-primary btn-sm"
                onClick={handleAssign}
                disabled={!selectedAgent || assigning}
              >
                {assigning ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  'Asignar'
                )}
              </button>
            </div>
          )}

          {agents.length === 0 && (
            <p className="text-sm text-base-content/50">
              No tienes agentes configurados.{' '}
              <button
                className="link link-primary"
                onClick={() => navigate('/automations/agents')}
              >
                Crear un agente
              </button>
            </p>
          )}
        </div>
      </div>

      {/* Danger zone */}
      <div className="card bg-base-100 border border-error/30 shadow-sm">
        <div className="card-body gap-4 p-6">
          <SectionHeading icon={AlertTriangle} label="Zona de peligro" tone="error" />
          <button
            className="btn btn-outline btn-error btn-sm w-fit gap-1"
            onClick={() => setConfirmDelete(true)}
          >
            <Trash2 size={14} /> Eliminar canal
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
        title="Eliminar canal"
        description={`¿Confirmas eliminar "${channel.name}"? Dejará de estar disponible y no aparecerá en tus listados. Se conserva por auditoría; contacta a soporte si necesitas recuperarlo.`}
        confirmText={deleting ? 'Eliminando...' : 'Eliminar'}
        variant="danger"
      />
    </div>
  );
};
