import {
  YoutubeCompetitorChannel,
  YoutubeCompetitorVideoStats,
} from '@features/youtube-analytics/types/competitor.type';
import { CompetitorCardMetrics } from '@features/youtube-analytics/components/CompetitorCardMetrics';
import { useRemoveCompetitor } from '@features/youtube-analytics/hooks/useCompetitors';
import { buildChannelUrl } from '@features/youtube-analytics/utils/build-channel-url.util';
import { formatCompetitorHandle } from '@features/youtube-analytics/utils/format-competitor-handle.util';
import { ArrowUpRight, Clock, Trash2, Video } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

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
  const topThumbnail = topVideos[0]?.thumbnailUrl ?? null;

  return (
    <div className="group relative card bg-base-100 border border-base-300 shadow-sm transition-all duration-200 hover:border-base-content/20">
      <Link
        to={`/redes-sociales/youtube/competencia/${competitor.id}`}
        className="absolute inset-x-0 top-0 z-10 flex items-center justify-center gap-1.5 rounded-t-2xl bg-primary py-2 text-xs font-bold text-primary-content opacity-0 transition-opacity sm:opacity-0 group-hover:opacity-100"
      >
        Ver todos los videos <ArrowUpRight size={14} />
      </Link>

      <div className="card-body gap-4 p-6">
        <div className="flex items-start justify-between">
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-2xl bg-error/10 text-error flex items-center justify-center">
            {topThumbnail ? (
              <img src={topThumbnail} alt="" className="h-full w-full object-cover" />
            ) : (
              <Video size={22} />
            )}
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
          <a
            href={buildChannelUrl(competitor.channelHandleOrUrl)}
            target="_blank"
            rel="noreferrer"
            className="font-bold text-base-content leading-tight truncate hover:text-primary hover:underline block"
          >
            {formatCompetitorHandle(competitor.channelHandleOrUrl)}
          </a>
          <p className="text-xs text-base-content/50">
            {formatLastSynced(competitor.lastSyncedAt)}
          </p>
        </div>

        <CompetitorCardMetrics videos={videos} />

        {topVideos.length > 0 ? (
          <ul className="space-y-2 border-t border-base-300 pt-4">
            {topVideos.map((video) => (
              <li key={video.id} className="flex items-center gap-3 text-sm">
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-base-300 flex items-center justify-center">
                  {video.thumbnailUrl ? (
                    <img
                      src={video.thumbnailUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Video size={16} className="text-base-content/30" />
                  )}
                </div>
                <span className="flex-1 truncate text-base-content/80">
                  {video.title}
                </span>
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
