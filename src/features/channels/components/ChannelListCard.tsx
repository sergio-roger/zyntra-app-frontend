import { CHANNEL_ICONS } from '@features/channels/constants/channels.constants';
import { Channel } from '@features/channels/types/channels.types';
import { Ban, Bot, Calendar, Code2, Globe, MoreHorizontal, Settings2, Trash2 } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const formatCreatedAt = (iso: string) =>
  new Date(iso).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' });

interface ChannelListCardProps {
  channel: Channel;
  onShowSnippet: () => void;
  onDeactivate: () => void;
  onDelete: () => void;
}

export const ChannelListCard: React.FC<ChannelListCardProps> = ({
  channel,
  onShowSnippet,
  onDeactivate,
  onDelete,
}) => {
  const navigate = useNavigate();

  return (
    <div
      data-testid={`channel-row-${channel.id}`}
      className="card bg-base-100 border border-base-300 shadow-sm transition-all duration-200 hover:border-base-content/20"
    >
      <div className="card-body gap-4 p-6">
        <div className="flex items-start justify-between">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            {CHANNEL_ICONS[channel.channelType?.key ?? ''] ?? <Globe size={26} />}
          </div>
          <span className={`badge ${channel.status === 'active' ? 'badge-success' : 'badge-ghost'}`}>
            {channel.status === 'active' ? 'Activo' : 'Inactivo'}
          </span>
        </div>

        <div className="space-y-1">
          <h3 className="font-bold text-lg leading-tight">{channel.name}</h3>
          <p className="text-sm text-base-content/60">{channel.channelType?.label ?? 'Canal'}</p>
        </div>

        <div className="flex items-center gap-3 text-xs text-base-content/45">
          <span className="inline-flex items-center gap-1">
            <Calendar size={12} /> {formatCreatedAt(channel.createdAt)}
          </span>
          {channel.agentId && (
            <span className="inline-flex items-center gap-1">
              <Bot size={12} /> Agente asignado
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 pt-4 border-t border-base-300">
          <button
            className="btn btn-outline btn-sm gap-1"
            onClick={() => navigate(`/inbox/channels/${channel.id}/edit`)}
          >
            <Settings2 size={14} /> Editar
          </button>

          <div className="dropdown dropdown-end dropdown-top">
            <label tabIndex={0} className="btn btn-ghost btn-sm btn-circle">
              <MoreHorizontal size={16} />
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow-xl bg-base-200 rounded-xl w-52 border border-base-300"
            >
              <li>
                <a className="text-sm flex items-center gap-2" onClick={onShowSnippet}>
                  <Code2 size={14} /> Ver snippet
                </a>
              </li>
              <li>
                <a className="text-sm flex items-center gap-2 text-warning" onClick={onDeactivate}>
                  <Ban size={14} /> Desactivar
                </a>
              </li>
              <li>
                <a className="text-sm flex items-center gap-2 text-error" onClick={onDelete}>
                  <Trash2 size={14} /> Eliminar
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
