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
import {
  useChannelStoreQuery,
  useChannelsQuery,
} from '../hooks/channels.queries';
import { ChannelType, Channel } from '../types/channels.types';
import { PageHeader } from '@shared/components/PageHeader';

const CHANNEL_ICONS: Record<string, React.ReactNode> = {
  web_chat: <Globe size={32} />,
  facebook: <MessageCircle size={32} />,
  telegram: <Send size={32} />,
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
  const disabled = !channelType.isAvailable;
  const isWebChat = channelType.key === 'web_chat';
  
  // Si es web_chat, siempre permitimos crear múltiples, por lo que no se muestra como "Activo" permanente.
  const isCurrentlyActive = existingChannel && !isWebChat;

  return (
    <div
      data-testid={`channel-card-${channelType.key}`}
      className={`card bg-base-100 border shadow-sm transition-all duration-200 ${
        disabled
          ? 'opacity-60 cursor-not-allowed border-base-300'
          : 'border-base-300 hover:border-primary hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 cursor-pointer'
      }`}
    >
      <div className="card-body gap-4 p-6">
        <div className="flex items-start justify-between">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
              disabled ? 'bg-base-200 text-base-content/40' : 'text-primary'
            }`}
            style={
              disabled
                ? undefined
                : {
                    backgroundImage:
                      'radial-gradient(circle at 50% 35%, rgba(124,58,237,0.22) 0%, transparent 70%)',
                  }
            }
          >
            {CHANNEL_ICONS[channelType.key] ?? <Globe size={32} />}
          </div>
          <div className="flex flex-col items-end gap-1">
            {disabled ? (
              <span className="badge badge-ghost gap-1">
                <Lock size={10} /> Próximamente
              </span>
            ) : isCurrentlyActive ? (
              <span className="badge badge-success">Activo</span>
            ) : isWebChat && existingChannel ? (
              <span className="badge badge-info">Configurado</span>
            ) : (
              <span className="badge badge-primary badge-outline">
                Disponible
              </span>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="font-bold text-lg leading-tight">{channelType.label}</h3>
          {channelType.description && (
            <p className="text-sm text-base-content/60 leading-relaxed">
              {channelType.description}
            </p>
          )}
        </div>

        <div className="card-actions justify-end mt-2 pt-4 border-t border-base-300">
          {disabled ? (
            <button className="btn btn-ghost btn-sm" disabled>
              No disponible
            </button>
          ) : isCurrentlyActive ? (
            <button
              className="btn btn-outline btn-sm gap-1 w-full"
              onClick={() => onActivate(channelType)}
            >
              Ver configuración <ArrowRight size={14} />
            </button>
          ) : (
            <button
              data-testid={`activate-${channelType.key}`}
              className="btn btn-sm gap-1 w-full bg-tertiary hover:opacity-90 text-tertiary-content border-none"
              onClick={() => onActivate(channelType)}
            >
              <Plus size={14} /> {isWebChat && existingChannel ? 'Agregar otro' : 'Activar'}
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
  } = useChannelStoreQuery();
  const { data: channels = [], isLoading: loadingChannels } =
    useChannelsQuery();

  const isLoading = loadingStore || loadingChannels;

  const handleActivate = (ct: ChannelType) => {
    // Si es web_chat permitimos agregar múltiples, ignorando el chequeo de canal existente
    if (ct.key === 'web_chat') {
      navigate(
        `/settings/channels/new?type=${ct.id}&key=${ct.key}&label=${encodeURIComponent(ct.label)}`,
      );
      return;
    }

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
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title="Canal Store"
        subtitle="Activa los canales de comunicación con tus clientes."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {store.map((ct) => (
          <ChannelTypeCard
            key={ct.id}
            channelType={ct}
            existingChannel={channels.find((c) => c.channelTypeId === ct.id)}
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
