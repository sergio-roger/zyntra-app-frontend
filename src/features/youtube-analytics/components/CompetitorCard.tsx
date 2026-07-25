import {
  YoutubeCompetitorChannel,
  YoutubeCompetitorVideoStats,
} from '@features/youtube-analytics/types/competitor.type';
import { useRemoveCompetitor } from '@features/youtube-analytics/hooks/useCompetitors';
import { Clock, Trash2 } from 'lucide-react';
import React from 'react';

interface CompetitorCardProps {
  competitor: YoutubeCompetitorChannel;
  videos: YoutubeCompetitorVideoStats[];
}

const formatLastSynced = (lastSyncedAt: string | null): string => {
  if (!lastSyncedAt) return 'Sin datos aún';
  return `Última vez visto: ${new Date(lastSyncedAt).toLocaleDateString('es', {
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
    <div className="card bg-base-100 border border-base-300 shadow-sm">
      <div className="card-body gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-bold text-base-content leading-tight">
              {competitor.channelHandleOrUrl}
            </h3>
            <p className="text-xs text-base-content/50 mt-0.5">
              {formatLastSynced(competitor.lastSyncedAt)}
            </p>
          </div>
          <div className="flex items-center gap-2">
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
            <button
              onClick={() => removeCompetitor.mutate(competitor.id)}
              disabled={removeCompetitor.isPending}
              aria-label="Eliminar canal de competencia"
              className="rounded-md p-1.5 text-base-content/50 transition-colors hover:bg-error/10 hover:text-error cursor-pointer"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>

        {topVideos.length > 0 && (
          <ul className="space-y-2 border-t border-base-300 pt-3">
            {topVideos.map((video) => (
              <li key={video.id} className="flex items-center justify-between gap-2 text-sm">
                <span className="truncate text-base-content/80">{video.title}</span>
                <span className="shrink-0 font-semibold text-base-content/60">
                  {video.views.toLocaleString('es')} vistas
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
