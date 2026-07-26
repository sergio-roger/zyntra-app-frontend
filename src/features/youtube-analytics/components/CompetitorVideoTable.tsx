import { YoutubeCompetitorVideoStats } from '@features/youtube-analytics/types/competitor.type';
import { ArrowDown, ArrowUp, Video } from 'lucide-react';
import React, { useMemo, useState } from 'react';

type SortKey = 'views' | 'likes' | 'comments';

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: 'views', label: 'Vistas' },
  { key: 'likes', label: 'Likes' },
  { key: 'comments', label: 'Comentarios' },
];

interface CompetitorVideoTableProps {
  videos: YoutubeCompetitorVideoStats[];
}

export const CompetitorVideoTable: React.FC<CompetitorVideoTableProps> = ({
  videos,
}) => {
  const [sortKey, setSortKey] = useState<SortKey>('views');

  const sorted = useMemo(
    () => [...videos].sort((a, b) => b[sortKey] - a[sortKey]),
    [videos, sortKey],
  );

  if (videos.length === 0) {
    return null;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-base-300 bg-base-100 shadow-sm">
      <table className="w-full text-left text-sm border-collapse">
        <thead className="border-b border-base-300 bg-base-300/30 text-xs text-base-content/60 uppercase">
          <tr>
            <th className="px-4 py-3 font-semibold" />
            <th className="px-4 py-3 font-semibold">Video</th>
            {COLUMNS.map((col) => (
              <th key={col.key} className="px-4 py-3 font-semibold">
                <button
                  onClick={() => setSortKey(col.key)}
                  className="inline-flex items-center gap-1 cursor-pointer hover:text-base-content transition-colors"
                >
                  {col.label}
                  {sortKey === col.key ? (
                    <ArrowDown size={12} />
                  ) : (
                    <ArrowUp size={12} className="opacity-30" />
                  )}
                </button>
              </th>
            ))}
            <th className="px-4 py-3 font-semibold">Publicado</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((video) => (
            <tr
              key={video.videoId}
              className="border-b border-base-300/50 transition-colors last:border-0 hover:bg-base-300/20"
            >
              <td className="px-4 py-3 align-middle">
                <div className="h-10 w-10 overflow-hidden rounded-lg bg-base-300 flex items-center justify-center">
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
              </td>
              <td className="px-4 py-3 align-middle font-medium">
                <a
                  href={`https://www.youtube.com/watch?v=${video.videoId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-base-content hover:text-primary hover:underline transition-colors"
                >
                  {video.title}
                </a>
              </td>
              <td className="px-4 py-3 align-middle">
                {video.views.toLocaleString('es')}
              </td>
              <td className="px-4 py-3 align-middle">
                {video.likes.toLocaleString('es')}
              </td>
              <td className="px-4 py-3 align-middle">
                {video.comments.toLocaleString('es')}
              </td>
              <td className="px-4 py-3 align-middle text-base-content/60">
                {new Date(video.publishedAt).toLocaleDateString('es')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
