import { YoutubeInterestVideo } from '@features/youtube-analytics/types/video-interest.type';
import { formatVideoDuration } from '@features/youtube-analytics/utils/format-video-duration.util';
import { Video } from 'lucide-react';
import React from 'react';

interface VideoCardProps {
  video: YoutubeInterestVideo;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const duration = formatVideoDuration(video.durationSeconds);

  return (
    <div className="rounded-2xl border border-base-300 bg-base-200 overflow-hidden">
      <div className="relative aspect-video bg-base-300 flex items-center justify-center">
        {video.thumbnailUrl ? (
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <Video size={32} className="text-base-content/30" />
        )}
        {duration && (
          <span className="absolute bottom-1.5 right-1.5 rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-bold text-white">
            {duration}
          </span>
        )}
      </div>

      <div className="p-3 space-y-1">
        <h4 className="text-sm font-bold text-base-content line-clamp-2">
          {video.title}
        </h4>
        <p className="text-xs text-base-content/60">{video.channelName}</p>
        <div className="flex items-center justify-between text-xs text-base-content/50">
          <span>{video.viewCount.toLocaleString('es-AR')} vistas</span>
          {video.likeCount !== null && (
            <span>{video.likeCount.toLocaleString('es-AR')} likes</span>
          )}
        </div>
        {video.uploadedAt && (
          <p className="text-[10px] text-base-content/40">
            {new Date(video.uploadedAt).toLocaleDateString('es-AR')}
          </p>
        )}
      </div>
    </div>
  );
};
