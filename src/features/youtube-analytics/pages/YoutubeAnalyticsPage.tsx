import { Button } from '@core/ui/Button';
import { YoutubeConnectedTabs } from '@features/youtube-analytics/components/YoutubeConnectedTabs';
import {
  buildYoutubeOAuthConnectUrl,
  ownChannelKeys,
  useOwnChannelStatus,
} from '@features/youtube-analytics/hooks/useOwnChannel';
import { getDisconnectedCopy } from '@features/youtube-analytics/utils/disconnected-channel-copy.util';
import { useQueryClient } from '@tanstack/react-query';
import { EmptyState } from '@shared/components/EmptyState';
import { PageHeader } from '@shared/components/PageHeader';
import { toastManager } from '@shared/components/toast/toastManager';
import { AlertTriangle, Loader2, Video } from 'lucide-react';
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const OwnChannelSection: React.FC = () => {
  const { data: status, isLoading: isLoadingStatus } = useOwnChannelStatus();

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
    const { title, description } = getDisconnectedCopy(status.status);
    return (
      <div className="rounded-2xl border border-warning/20 bg-warning/10 p-6 flex flex-col sm:flex-row items-center gap-4">
        <AlertTriangle size={28} className="text-warning shrink-0" />
        <div className="flex-1 text-center sm:text-left">
          <h3 className="font-bold text-base-content">{title}</h3>
          <p className="text-sm text-base-content/60 mt-1">{description}</p>
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

  return <YoutubeConnectedTabs />;
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
    </div>
  );
};

export default YoutubeAnalyticsPage;
