import { youtubeAnalyticsApi } from '@features/youtube-analytics/api/youtube-analytics.api';
import { getApiErrorMessage } from '@shared/constants/apiErrors';
import { toastManager } from '@shared/components/toast/toastManager';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const ownChannelKeys = {
  status: ['youtube-analytics', 'own-channel', 'status'] as const,
  dashboard: ['youtube-analytics', 'own-channel', 'dashboard'] as const,
};

export const useOwnChannelStatus = () =>
  useQuery({
    queryKey: ownChannelKeys.status,
    queryFn: async () => {
      const res = await youtubeAnalyticsApi.getOwnChannelStatus();
      return res.data;
    },
  });

export const useOwnChannelDashboard = (options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: ownChannelKeys.dashboard,
    queryFn: async () => {
      const res = await youtubeAnalyticsApi.getOwnChannelDashboard();
      return res.data;
    },
    enabled: options?.enabled ?? true,
  });

export const useDisconnectOwnChannel = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => youtubeAnalyticsApi.disconnectOwnChannel(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ownChannelKeys.status });
      qc.invalidateQueries({ queryKey: ownChannelKeys.dashboard });
      toastManager.add({ title: 'Canal de YouTube desconectado', type: 'success' });
    },
    onError: (error) => {
      toastManager.add({
        title: 'No se pudo desconectar el canal',
        description: getApiErrorMessage(error),
        type: 'error',
      });
    },
  });
};

export function buildYoutubeOAuthConnectUrl(): string {
  const apiBaseUrl = import.meta.env.VITE_API_URL || '/api';
  return `${apiBaseUrl}/youtube-analytics/oauth/connect`;
}
