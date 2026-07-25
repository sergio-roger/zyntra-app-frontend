import React, { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useChannelQuery } from '../hooks/channels.queries';
import { Channel } from '../types/channels.types';
import { WebChannelStepForm } from '../components/web-channel-form/WebChannelStepForm';
import { EmbedSnippetModal } from '../components/EmbedSnippetModal';

export const WebChannelStepFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { channelId } = useParams<{ channelId: string }>();
  const [params] = useSearchParams();
  const mode: 'create' | 'edit' = channelId ? 'edit' : 'create';
  const typeId = params.get('type') ?? '';

  const {
    data: channel,
    isLoading,
    isError,
  } = useChannelQuery(mode === 'edit' ? (channelId ?? '') : '');

  const [createdChannel, setCreatedChannel] = useState<Channel | null>(null);

  const handleCancel = () => navigate('/settings/my-channels');
  const handleUpdated = () => navigate('/settings/my-channels');

  if (mode === 'edit' && isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (mode === 'edit' && (isError || !channel)) {
    return (
      <div className="flex items-center gap-2 max-w-lg mx-auto mt-8 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
        <AlertCircle size={18} className="shrink-0" />
        <span>No se pudo cargar el canal.</span>
      </div>
    );
  }

  return (
    <div>
      <WebChannelStepForm
        key={mode === 'edit' ? channelId : 'create'}
        mode={mode}
        channel={channel}
        typeId={typeId}
        onCancel={handleCancel}
        onCreated={setCreatedChannel}
        onUpdated={handleUpdated}
      />

      {createdChannel && (
        <EmbedSnippetModal
          isOpen={!!createdChannel}
          onClose={() => navigate('/settings/my-channels')}
          channelId={createdChannel.id}
          channelName={createdChannel.name}
        />
      )}
    </div>
  );
};
