import {
  YoutubeCompetitorChannel,
  YoutubeCompetitorVideoStats,
} from '@features/youtube-analytics/types/competitor.type';
import { useRemoveCompetitor } from '@features/youtube-analytics/hooks/useCompetitors';
import { formatCompetitorHandle } from '@features/youtube-analytics/utils/format-competitor-handle.util';
import { Clock, Trash2, Video } from 'lucide-react';
import React from 'react';

interface CompetitorCardProps {
  competitor: YoutubeCompetitorChannel;
  videos: YoutubeCompetitorVideoStats[];
}

const formatLastSynced = (lastSyncedAt: string | null): string => {
  if (!lastSyncedAt) return 'Sin sincronizar aún';
  return `Actualizado ${new Date(lastSyncedAt).toLocaleDateString('es', {
    day: '2-digit',
    month: 'short',
  })}`;
};

export const CompetitorCard: React.FC<CompetitorCardProps> = ({
  competitor,
  videos,
}) => {
  const removeCompetitor = useRemoveCompetitor();
  const topVideos = [...videos].sort((a, b) => b.views - a.views).slice(0, 3);

  return (
    <div className="card bg-base-100 border border-base-300 shadow-sm transition-all duration-200 hover:border-base-content/20">
      <div className="card-body gap-4 p-6">
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-error/10 text-error flex items-center justify-center shrink-0">
            <Video size={22} />
          </div>
          {competitor.status === 'stale' ? (
            <span className="badge badge-warning gap-1 whitespace-nowrap">
              <Clock size={10} /> Stale
            </span>
          ) : videos.length === 0 ? (
            <span className="badge badge-ghost whitespace-nowrap">
              Sin datos aún
            </span>
          ) : (
            <span className="badge badge-success whitespace-nowrap">Al día</span>
          )}
        </div>

        <div className="space-y-1 min-w-0">
          <h3 className="font-bold text-base-content leading-tight truncate">
            {formatCompetitorHandle(competitor.channelHandleOrUrl)}
          </h3>
          <p className="text-xs text-base-content/50">
            {formatLastSynced(competitor.lastSyncedAt)}
          </p>
        </div>

        {topVideos.length > 0 ? (
          <ul className="space-y-2 border-t border-base-300 pt-4">
            {topVideos.map((video) => (
              <li
                key={video.id}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span className="truncate text-base-content/80">{video.title}</span>
                <span className="shrink-0 font-semibold text-base-content/60">
                  {video.views.toLocaleString('es')}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="border-t border-base-300 pt-4 text-sm text-base-content/40">
            Todavía no hay videos monitoreados.
          </p>
        )}

        <div className="flex items-center justify-end pt-2 border-t border-base-300">
          <button
            onClick={() => removeCompetitor.mutate(competitor.id)}
            disabled={removeCompetitor.isPending}
            className="btn btn-ghost btn-sm gap-1 text-error hover:bg-error/10"
          >
            <Trash2 size={14} /> Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};
