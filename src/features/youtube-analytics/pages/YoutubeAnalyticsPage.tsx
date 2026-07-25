import { Button } from '@core/ui/Button';
import { ChannelGrowthCharts } from '@features/youtube-analytics/components/ChannelGrowthCharts';
import { CompetitorsSection } from '@features/youtube-analytics/components/CompetitorsSection';
import { OwnChannelKpiRow } from '@features/youtube-analytics/components/OwnChannelKpiRow';
import { VideoRankingTable } from '@features/youtube-analytics/components/VideoRankingTable';
import {
  buildYoutubeOAuthConnectUrl,
  ownChannelKeys,
  useDisconnectOwnChannel,
  useOwnChannelDashboard,
  useOwnChannelStatus,
} from '@features/youtube-analytics/hooks/useOwnChannel';
import { useQueryClient } from '@tanstack/react-query';
import { EmptyState } from '@shared/components/EmptyState';
import { PageHeader } from '@shared/components/PageHeader';
import { toastManager } from '@shared/components/toast/toastManager';
import { AlertTriangle, Loader2, LogOut, Video } from 'lucide-react';
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const OwnChannelSection: React.FC = () => {
  const { data: status, isLoading: isLoadingStatus } = useOwnChannelStatus();
  const disconnect = useDisconnectOwnChannel();
  const isConnected = status?.status === 'connected';

  const {
    data: dashboard,
    isLoading: isLoadingDashboard,
    isError,
  } = useOwnChannelDashboard({ enabled: isConnected });

  if (isLoadingStatus) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="animate-spin text-primary" size={28} />
      </div>
    );
  }

  if (!status) {
    return (
      <EmptyState
        icon={Video}
        title="Conectá tu canal de YouTube"
        description="Iniciá sesión con Google para empezar a ver la analítica de tu canal propio."
        actionLabel="Conectar con Google"
        onAction={() => {
          window.location.href = buildYoutubeOAuthConnectUrl();
        }}
      />
    );
  }

  if (status.status !== 'connected') {
    return (
      <div className="rounded-2xl border border-warning/20 bg-warning/10 p-6 flex flex-col sm:flex-row items-center gap-4">
        <AlertTriangle size={28} className="text-warning shrink-0" />
        <div className="flex-1 text-center sm:text-left">
          <h3 className="font-bold text-base-content">
            Tu conexión con YouTube expiró
          </h3>
          <p className="text-sm text-base-content/60 mt-1">
            Reconectá tu cuenta de Google para seguir recolectando datos de tu
            canal. Tu historial ya guardado no se pierde.
          </p>
        </div>
        <Button
          onClick={() => {
            window.location.href = buildYoutubeOAuthConnectUrl();
          }}
        >
          Reconectar
        </Button>
      </div>
    );
  }

  if (isLoadingDashboard) {
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

const useYoutubeOAuthRedirectToast = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  useEffect(() => {
    const youtubeParam = searchParams.get('youtube');
    if (!youtubeParam) return;

    if (youtubeParam === 'connected') {
      toastManager.add({ title: 'Canal de YouTube conectado', type: 'success' });
      queryClient.invalidateQueries({ queryKey: ownChannelKeys.status });
    } else {
      toastManager.add({
        title: 'No se pudo conectar el canal de YouTube',
        description: 'Intenta de nuevo desde el botón "Conectar con Google".',
        type: 'error',
      });
    }

    searchParams.delete('youtube');
    setSearchParams(searchParams, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export const YoutubeAnalyticsPage: React.FC = () => {
  useYoutubeOAuthRedirectToast();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title="YouTube"
        subtitle="Analítica de tu canal propio y de tu competencia."
      />

      <OwnChannelSection />

      <div className="divider" />

      <CompetitorsSection />
    </div>
  );
};

export default YoutubeAnalyticsPage;
