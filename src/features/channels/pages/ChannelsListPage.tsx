import { EmbedSnippetModal } from '@features/channels/components/EmbedSnippetModal';
import { CHANNEL_ICONS } from '@features/channels/constants/channels.constants';
import {
  useChannelsQuery,
  useChannelStoreQuery,
  useDeleteChannelMutation,
} from '@features/channels/hooks/channels.queries';
import { Channel } from '@features/channels/types/channels.types';
import { ConfirmModal } from '@shared/components/ConfirmModal';
import { EmptyState } from '@shared/components/EmptyState';
import { toastManager } from '@shared/components/toast/toastManager';
import {
  AlertCircle,
  Bot,
  Code2,
  Globe,
  Loader2,
  Plus,
  Radio,
  Settings2,
  Trash2
} from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const ChannelsListPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    data: channels = [],
    isLoading,
    isError,
    refetch,
  } = useChannelsQuery();
  const { data: store = [] } = useChannelStoreQuery();

  const { mutateAsync: deleteChannel, isPending: deactivating } =
    useDeleteChannelMutation();

  const [snippetChannel, setSnippetChannel] = useState<Channel | null>(null);
  const [deactivatingChannel, setDeactivatingChannel] =
    useState<Channel | null>(null);

  const webChatType = store.find((ct) => ct.key === 'web_chat');

  const handleCreate = () => {
    if (!webChatType) return;
    navigate(
      `/settings/channels/new?type=${webChatType.id}&key=web_chat&label=${encodeURIComponent(webChatType.label)}`,
    );
  };

  const handleDeactivate = async () => {
    if (!deactivatingChannel) return;
    try {
      await deleteChannel(deactivatingChannel.id);
      toastManager.add({
        title: 'Canal desactivado',
        description: `${deactivatingChannel.name} ya no responderá en los sitios donde esté embebido.`,
        type: 'success',
      });
    } catch {
      toastManager.add({
        title: 'Error al desactivar el canal',
        description: 'Inténtalo de nuevo en unos segundos.',
        type: 'error',
      });
    }
  };

  const handleRedirectToStore = () => {
    navigate('/settings/channels');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-lg mx-auto mt-8 space-y-3">
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>No se pudieron cargar tus canales.</span>
        </div>
        <button className="btn btn-outline btn-sm" onClick={() => refetch()}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="px-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Mis Canales</h1>
          <p className="text-base-content/60 mt-1">
            Administra los canales de comunicación con tus clientes.
          </p>
        </div>
        <button
          className="btn btn-primary gap-1"
          onClick={handleCreate}
          disabled={!webChatType}
          data-testid="create-web-channel"
        >
          <Plus size={16} /> Crear canal web
        </button>
      </div>

      {channels.length === 0 ? (
        <EmptyState
          icon={Radio}
          title="Aún no tienes canales"
          description="Crea tu primer canal para empezar a recibir mensajes de tus clientes."
          actionLabel="Crear canal"
          onAction={handleRedirectToStore}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {channels.map((channel) => (
            <div
              key={channel.id}
              data-testid={`channel-row-${channel.id}`}
              className="card bg-base-100 border border-base-300 shadow-sm"
            >
              <div className="card-body gap-3">
                <div className="flex items-start justify-between">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    {CHANNEL_ICONS[channel.channelType?.key ?? ''] ?? (
                      <Globe size={22} />
                    )}
                  </div>
                  <span
                    className={`badge ${channel.status === 'active' ? 'badge-success' : 'badge-ghost'}`}
                  >
                    {channel.status === 'active' ? 'Activo' : 'Inactivo'}
                  </span>
                </div>

                <div>
                  <h3 className="font-semibold text-base">{channel.name}</h3>
                  <p className="text-sm text-base-content/60">
                    {channel.channelType?.label ?? 'Canal'}
                  </p>
                  {channel.agentId && (
                    <p className="text-xs text-base-content/50 flex items-center gap-1 mt-1">
                      <Bot size={12} /> Agente asignado
                    </p>
                  )}
                </div>

                <div className="card-actions justify-end mt-1 gap-1">
                  <button
                    className="btn btn-ghost btn-sm gap-1"
                    onClick={() =>
                      navigate(`/settings/channels/${channel.id}/edit`)
                    }
                  >
                    <Settings2 size={14} /> Editar
                  </button>
                  <button
                    className="btn btn-ghost btn-sm gap-1"
                    onClick={() => setSnippetChannel(channel)}
                  >
                    <Code2 size={14} /> Snippet
                  </button>
                  <button
                    className="btn btn-ghost btn-sm gap-1 text-error"
                    onClick={() => setDeactivatingChannel(channel)}
                  >
                    <Trash2 size={14} /> Desactivar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {snippetChannel && (
        <EmbedSnippetModal
          isOpen={!!snippetChannel}
          onClose={() => setSnippetChannel(null)}
          channelId={snippetChannel.id}
          channelName={snippetChannel.name}
        />
      )}

      <ConfirmModal
        isOpen={!!deactivatingChannel}
        onClose={() => setDeactivatingChannel(null)}
        onConfirm={handleDeactivate}
        title="Desactivar canal"
        description={`¿Confirmas desactivar "${deactivatingChannel?.name}"? El widget dejará de responder en los sitios donde esté embebido.`}
        confirmText={deactivating ? 'Desactivando...' : 'Desactivar'}
        variant="danger"
      />
    </div>
  );
};
