import { youtubeAnalyticsApi } from '@features/youtube-analytics/api/youtube-analytics.api';
import { CreateCompetitorChannelInput } from '@features/youtube-analytics/types/competitor.type';
import { getApiErrorMessage } from '@shared/constants/apiErrors';
import { toastManager } from '@shared/components/toast/toastManager';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const competitorsKeys = {
  dashboard: ['youtube-analytics', 'competitors', 'dashboard'] as const,
  videos: (competitorId: string) =>
    ['youtube-analytics', 'competitors', competitorId, 'videos'] as const,
};

export const useCompetitorsDashboard = () =>
  useQuery({
    queryKey: competitorsKeys.dashboard,
    queryFn: async () => {
      const res = await youtubeAnalyticsApi.getCompetitorsDashboard();
      return res.data;
    },
  });

export const useCompetitorVideos = (competitorId: string) =>
  useQuery({
    queryKey: competitorsKeys.videos(competitorId),
    queryFn: async () => {
      const res = await youtubeAnalyticsApi.getCompetitorVideos(competitorId);
      return res.data;
    },
    enabled: !!competitorId,
  });

export const useCreateCompetitor = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateCompetitorChannelInput) =>
      youtubeAnalyticsApi.createCompetitor(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: competitorsKeys.dashboard });
      toastManager.add({ title: 'Canal de competencia agregado', type: 'success' });
    },
    onError: (error) => {
      toastManager.add({
        title: 'No se pudo agregar el canal',
        description: getApiErrorMessage(error),
        type: 'error',
      });
    },
  });
};

export const useRemoveCompetitor = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => youtubeAnalyticsApi.removeCompetitor(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: competitorsKeys.dashboard });
      toastManager.add({ title: 'Canal de competencia eliminado', type: 'success' });
    },
    onError: (error) => {
      toastManager.add({
        title: 'No se pudo eliminar el canal',
        description: getApiErrorMessage(error),
        type: 'error',
      });
    },
  });
};
