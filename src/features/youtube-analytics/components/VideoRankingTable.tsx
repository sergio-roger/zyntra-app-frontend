import { YoutubeVideoDailyStats } from '@features/youtube-analytics/types/own-channel.type';
import { EmptyState } from '@shared/components/EmptyState';
import { ArrowDown, ArrowUp, Video } from 'lucide-react';
import React, { useMemo, useState } from 'react';

type SortKey = 'views' | 'avgViewDuration' | 'thumbnailCtr';

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: 'views', label: 'Vistas' },
  { key: 'avgViewDuration', label: 'Retención (seg)' },
  { key: 'thumbnailCtr', label: 'CTR (%)' },
];

interface VideoRankingTableProps {
  videos: YoutubeVideoDailyStats[];
}

export const VideoRankingTable: React.FC<VideoRankingTableProps> = ({
  videos,
}) => {
  const [sortKey, setSortKey] = useState<SortKey>('views');

  const sorted = useMemo(
    () => [...videos].sort((a, b) => b[sortKey] - a[sortKey]),
    [videos, sortKey],
  );

  if (videos.length === 0) {
    return (
      <EmptyState
        icon={Video}
        title="Todavía no hay videos con datos"
        description="En cuanto corra el primer job diario vas a ver el ranking de tus videos acá."
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-base-300 bg-base-100 shadow-sm">
      <table className="w-full text-left text-sm border-collapse">
        <thead className="border-b border-base-300 bg-base-300/30 text-xs text-base-content/60 uppercase">
          <tr>
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
          </tr>
        </thead>
        <tbody>
          {sorted.map((video) => (
            <tr
              key={video.videoId}
              className="border-b border-base-300/50 transition-colors last:border-0 hover:bg-base-300/20"
            >
              <td className="px-4 py-3 align-middle font-medium">
                <a
                  href={`https://www.youtube.com/watch?v=${video.videoId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-base-content hover:text-primary hover:underline transition-colors"
                >
                  {video.videoId}
                </a>
              </td>
              <td className="px-4 py-3 align-middle">
                {video.views.toLocaleString('es')}
              </td>
              <td className="px-4 py-3 align-middle">{video.avgViewDuration}s</td>
              <td className="px-4 py-3 align-middle">
                {video.thumbnailCtr.toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
