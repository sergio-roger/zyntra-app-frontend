import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Globe,
  MessageCircle,
  Send,
  Lock,
  Plus,
  ArrowRight,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useChannelStore, useChannels } from '../hooks/useChannels';
import { ChannelType, Channel } from '../types/channels.types';

const CHANNEL_ICONS: Record<string, React.ReactNode> = {
  web_chat: <Globe size={28} />,
  facebook: <MessageCircle size={28} />,
  telegram: <Send size={28} />,
};

interface ChannelTypeCardProps {
  channelType: ChannelType;
  existingChannel: Channel | undefined;
  onActivate: (ct: ChannelType) => void;
}

const ChannelTypeCard: React.FC<ChannelTypeCardProps> = ({
  channelType,
  existingChannel,
  onActivate,
}) => {
  const disabled = !channelType.is_available;

  return (
    <div
      data-testid={`channel-card-${channelType.key}`}
      className={`card bg-base-100 border shadow-sm transition-all ${
        disabled
          ? 'opacity-60 cursor-not-allowed border-base-300'
          : 'border-base-300 hover:border-primary hover:shadow-md cursor-pointer'
      }`}
    >
      <div className="card-body gap-3">
        <div className="flex items-start justify-between">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              disabled
                ? 'bg-base-200 text-base-content/40'
                : 'bg-primary/10 text-primary'
            }`}
          >
            {CHANNEL_ICONS[channelType.key] ?? <Globe size={28} />}
          </div>
          <div className="flex flex-col items-end gap-1">
            {disabled ? (
              <span className="badge badge-ghost badge-sm gap-1">
                <Lock size={10} /> Próximamente
              </span>
            ) : existingChannel ? (
              <span className="badge badge-success badge-sm">Activo</span>
            ) : (
              <span className="badge badge-primary badge-outline badge-sm">
                Disponible
              </span>
            )}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-base">{channelType.label}</h3>
          {channelType.description && (
            <p className="text-sm text-base-content/60 mt-0.5">
              {channelType.description}
            </p>
          )}
        </div>

        <div className="card-actions justify-end mt-1">
          {disabled ? (
            <button className="btn btn-ghost btn-sm" disabled>
              No disponible
            </button>
          ) : existingChannel ? (
            <button
              className="btn btn-ghost btn-sm gap-1"
              onClick={() => onActivate(channelType)}
            >
              Ver configuración <ArrowRight size={14} />
            </button>
          ) : (
            <button
              data-testid={`activate-${channelType.key}`}
              className="btn btn-primary btn-sm gap-1"
              onClick={() => onActivate(channelType)}
            >
              <Plus size={14} /> Activar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const ChannelStorePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    data: store = [],
    isLoading: loadingStore,
    isError: errorStore,
  } = useChannelStore();
  const { data: channels = [], isLoading: loadingChannels } = useChannels();

  const isLoading = loadingStore || loadingChannels;

  const handleActivate = (ct: ChannelType) => {
    const existing = channels.find((c) => c.channelType?.key === ct.key);
    if (existing) {
      navigate(`/settings/channels/${existing.id}`);
    } else {
      navigate(
        `/settings/channels/new?type=${ct.id}&key=${ct.key}&label=${encodeURIComponent(ct.label)}`,
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (errorStore) {
    return (
      <div className="alert alert-error max-w-lg mx-auto mt-8">
        <AlertCircle size={18} />
        <span>Error al cargar los canales disponibles. Intenta de nuevo.</span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Canal Store</h1>
        <p className="text-base-content/60 mt-1">
          Activa los canales de comunicación con tus clientes.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {store.map((ct) => (
          <ChannelTypeCard
            key={ct.id}
            channelType={ct}
            existingChannel={channels.find((c) => c.channel_type_id === ct.id)}
            onActivate={handleActivate}
          />
        ))}
      </div>

      {store.length === 0 && (
        <div className="text-center py-12 text-base-content/40">
          No hay canales disponibles en este momento.
        </div>
      )}
    </div>
  );
};
