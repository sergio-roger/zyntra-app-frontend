import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Copy,
  Check,
  Loader2,
  AlertCircle,
  Trash2,
  Bot,
  X,
} from 'lucide-react';
import {
  useChannel,
  useUpdateChannel,
  useDeleteChannel,
  useAssignAgent,
  useUnassignAgent,
} from '../hooks/useChannels';
import { useAiAgents } from '@features/ai-agents/hooks/useAiAgents';

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handle = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button className="btn btn-ghost btn-sm gap-1" onClick={handle}>
      {copied ? (
        <Check size={14} className="text-success" />
      ) : (
        <Copy size={14} />
      )}
      {copied ? 'Copiado' : 'Copiar'}
    </button>
  );
}

export const ChannelDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { channelId = '' } = useParams<{ channelId: string }>();
  const { data: channel, isLoading, isError } = useChannel(channelId);
  const { data: agents = [] } = useAiAgents();

  const { mutateAsync: updateChannel, isPending: saving } =
    useUpdateChannel(channelId);
  const { mutateAsync: deleteChannel, isPending: deleting } =
    useDeleteChannel();
  const { mutateAsync: assignAgent, isPending: assigning } =
    useAssignAgent(channelId);
  const { mutateAsync: unassignAgent, isPending: unassigning } =
    useUnassignAgent(channelId);

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
      await updateChannel({
        status: channel.status === 'active' ? 'inactive' : 'active',
      });
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
      await deleteChannel(channelId);
      navigate('/settings/channels');
    } catch {
      setError('No se puede eliminar el canal.');
      setConfirmDelete(false);
    }
  };

  const assignedAgent = agents.find((a) => a.id === channel.agentId);

  return (
    <div className="p-6">
      <button
        className="btn btn-ghost btn-sm gap-1 mb-6"
        onClick={() => navigate('/settings/channels')}
      >
        <ArrowLeft size={14} /> Canal Store
      </button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">{channel.name}</h1>
          <p className="text-sm text-base-content/60">
            {channel.channelType?.label ?? 'Canal'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`badge ${channel.status === 'active' ? 'badge-success' : 'badge-ghost'}`}
          >
            {channel.status === 'active' ? 'Activo' : 'Inactivo'}
          </span>
          <button
            className="btn btn-ghost btn-sm"
            onClick={handleToggleStatus}
            disabled={saving}
          >
            {channel.status === 'active' ? 'Desactivar' : 'Activar'}
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-error mb-4 text-sm">
          <AlertCircle size={16} /> <span>{error}</span>
          <button className="btn btn-ghost btn-xs" onClick={() => setError('')}>
            <X size={12} />
          </button>
        </div>
      )}

      {/* Embed code */}
      {channel.embedCode && (
        <div className="card bg-base-100 border border-base-300 shadow-sm mb-4">
          <div className="card-body gap-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Código de integración</h2>
              <CopyButton text={channel.embedCode} />
            </div>
            <pre className="text-xs font-mono bg-base-200 rounded-lg p-3 whitespace-pre-wrap break-all overflow-x-auto">
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
      <div className="card bg-base-100 border border-base-300 shadow-sm mb-4">
        <div className="card-body gap-4">
          <h2 className="font-semibold flex items-center gap-2">
            <Bot size={18} /> Agente de IA
          </h2>

          {assignedAgent ? (
            <div className="flex items-center justify-between bg-base-200 rounded-lg p-3">
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
                  .filter((a) => a.is_active)
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
                onClick={() => navigate('/settings/agents')}
              >
                Crear un agente
              </button>
            </p>
          )}
        </div>
      </div>

      {/* Danger zone */}
      <div className="card bg-base-100 border border-error/30 shadow-sm">
        <div className="card-body gap-3">
          <h2 className="font-semibold text-error">Zona de peligro</h2>
          {confirmDelete ? (
            <div className="flex items-center gap-2">
              <p className="text-sm flex-1">
                ¿Confirmas eliminar este canal? Esta acción no se puede
                deshacer.
              </p>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setConfirmDelete(false)}
              >
                Cancelar
              </button>
              <button
                className="btn btn-error btn-sm"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Trash2 size={14} />
                )}
                Eliminar
              </button>
            </div>
          ) : (
            <button
              className="btn btn-outline btn-error btn-sm w-fit gap-1"
              onClick={() => setConfirmDelete(true)}
            >
              <Trash2 size={14} /> Eliminar canal
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
