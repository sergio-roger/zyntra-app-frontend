import { ChannelListCard } from '@features/channels/components/ChannelListCard';
import { EmbedSnippetModal } from '@features/channels/components/EmbedSnippetModal';
import {
  useChannelsQuery,
  useChannelStoreQuery,
  useDeactivateChannelMutation,
  useRemoveChannelMutation,
} from '@features/channels/hooks/channels.queries';
import { Channel } from '@features/channels/types/channels.types';
import { ConfirmModal } from '@shared/components/ConfirmModal';
import { EmptyState } from '@shared/components/EmptyState';
import { PageHeader } from '@shared/components/PageHeader';
import { toastManager } from '@shared/components/toast/toastManager';
import { AlertCircle, Loader2, Plus, Radio } from 'lucide-react';
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

  const { mutateAsync: deactivateChannel, isPending: deactivating } =
    useDeactivateChannelMutation();
  const { mutateAsync: removeChannel, isPending: deleting } =
    useRemoveChannelMutation();

  const [snippetChannel, setSnippetChannel] = useState<Channel | null>(null);
  const [deactivatingChannel, setDeactivatingChannel] =
    useState<Channel | null>(null);
  const [deletingChannel, setDeletingChannel] = useState<Channel | null>(null);

  const webChatType = store.find((ct) => ct.key === 'web_chat');

  const handleCreate = () => {
    if (!webChatType) return;
    navigate(
      `/inbox/channels/new?type=${webChatType.id}&key=web_chat&label=${encodeURIComponent(webChatType.label)}`,
    );
  };

  const handleDeactivate = async () => {
    if (!deactivatingChannel) return;
    try {
      await deactivateChannel(deactivatingChannel.id);
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

  const handleConfirmDelete = async () => {
    if (!deletingChannel) return;
    try {
      await removeChannel(deletingChannel.id);
      toastManager.add({
        title: 'Canal eliminado',
        description: `${deletingChannel.name} ha sido eliminado con éxito.`,
        type: 'success',
      });
      setDeletingChannel(null);
    } catch {
      toastManager.add({
        title: 'Error al eliminar el canal',
        description: 'Inténtalo de nuevo en unos segundos.',
        type: 'error',
      });
    }
  };

  const handleRedirectToStore = () => {
    navigate('/inbox/channels');
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
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title="Mis Canales"
        subtitle="Administra los canales de comunicación con tus clientes."
        actions={
          <button
            className="btn gap-1 bg-tertiary hover:opacity-90 text-tertiary-content border-none"
            onClick={handleCreate}
            disabled={!webChatType}
            data-testid="create-web-channel"
          >
            <Plus size={16} /> Crear canal web
          </button>
        }
      />

      {channels.length === 0 ? (
        <EmptyState
          icon={Radio}
          title="Aún no tienes canales"
          description="Crea tu primer canal para empezar a recibir mensajes de tus clientes."
          actionLabel="Crear canal"
          onAction={handleRedirectToStore}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {channels.map((channel) => (
            <ChannelListCard
              key={channel.id}
              channel={channel}
              onShowSnippet={() => setSnippetChannel(channel)}
              onDeactivate={() => setDeactivatingChannel(channel)}
              onDelete={() => setDeletingChannel(channel)}
            />
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

      <ConfirmModal
        isOpen={!!deletingChannel}
        onClose={() => setDeletingChannel(null)}
        onConfirm={handleConfirmDelete}
        title="Eliminar canal"
        description={`¿Confirmas eliminar el canal "${deletingChannel?.name}"? Esta acción es permanente y no se puede deshacer.`}
        confirmText={deleting ? 'Eliminando...' : 'Eliminar'}
        variant="danger"
      />
    </div>
  );
};
