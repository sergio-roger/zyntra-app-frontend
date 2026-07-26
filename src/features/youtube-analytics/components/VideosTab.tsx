import { VideoCard } from '@features/youtube-analytics/components/VideoCard';
import { useInterestVideos } from '@features/youtube-analytics/hooks/useVideoInterests';
import { Loader2 } from 'lucide-react';
import React from 'react';

export const VideosTab: React.FC = () => {
  const { data: videos = [], isLoading } = useInterestVideos();

  if (isLoading || videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 h-48 text-center">
        <Loader2 className="animate-spin text-primary" size={28} />
        <p className="text-sm text-base-content/60">Buscando videos para vos...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
};
