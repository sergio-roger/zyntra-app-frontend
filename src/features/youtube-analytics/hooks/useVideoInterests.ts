import { youtubeAnalyticsApi } from '@features/youtube-analytics/api/youtube-analytics.api';
import { getApiErrorMessage } from '@shared/constants/apiErrors';
import { toastManager } from '@shared/components/toast/toastManager';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const videoInterestKeys = {
  catalog: ['youtube-analytics', 'video-interests', 'catalog'] as const,
  videos: ['youtube-analytics', 'video-interests', 'videos'] as const,
};

export const useVideoInterests = () =>
  useQuery({
    queryKey: videoInterestKeys.catalog,
    queryFn: async () => {
      const res = await youtubeAnalyticsApi.getVideoInterests();
      return res.data;
    },
  });

export const useSaveVideoInterestSelection = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (interestIds: string[]) =>
      youtubeAnalyticsApi.saveVideoInterestSelection(interestIds),
    onError: (error) => {
      toastManager.add({
        title: 'No se pudo guardar tu selección de intereses',
        description: getApiErrorMessage(error),
        type: 'error',
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: videoInterestKeys.videos });
    },
  });
};

export const useInterestVideos = (options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: videoInterestKeys.videos,
    queryFn: async () => {
      const res = await youtubeAnalyticsApi.getInterestVideos();
      return res.data;
    },
    enabled: options?.enabled ?? true,
  });
