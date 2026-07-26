import { Button } from '@core/ui/Button';
import { ChannelGrowthCharts } from '@features/youtube-analytics/components/ChannelGrowthCharts';
import { OwnChannelKpiRow } from '@features/youtube-analytics/components/OwnChannelKpiRow';
import { VideoRankingTable } from '@features/youtube-analytics/components/VideoRankingTable';
import {
  useDisconnectOwnChannel,
  useOwnChannelDashboard,
} from '@features/youtube-analytics/hooks/useOwnChannel';
import { Loader2, LogOut } from 'lucide-react';
import React from 'react';

export const YoutubeChannelTab: React.FC = () => {
  const disconnect = useDisconnectOwnChannel();
  const { data: dashboard, isLoading, isError } = useOwnChannelDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="animate-spin text-primary" size={28} />
      </div>
    );
  }

  if (isError || !dashboard) {
    return (
      <div className="alert alert-error">
        <span>No se pudo cargar la analítica de tu canal. Intenta de nuevo.</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-base-content">Canal propio</h2>
        <Button
          variant="secondary"
          outline
          size="sm"
          icon={LogOut}
          loading={disconnect.isPending}
          onClick={() => disconnect.mutate()}
        >
          Desconectar
        </Button>
      </div>

      <OwnChannelKpiRow
        channelDailyStats={dashboard.channelDailyStats}
        videoDailyStats={dashboard.videoDailyStats}
      />
      <ChannelGrowthCharts channelDailyStats={dashboard.channelDailyStats} />
      <VideoRankingTable videos={dashboard.videoDailyStats} />
    </div>
  );
};
