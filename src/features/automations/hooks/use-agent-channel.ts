import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@features/auth/store/authStore';
import { channelsApi } from '@features/channels/api/channels.api';
import { toastManager } from '@shared/components/toast/toastManager';
import { getApiErrorMessage } from '@shared/constants/apiErrors';

const CHANNELS_QUERY_KEY = (businessId: string) => ['automations-channels', businessId];

export function useChannelsList() {
  const businessId = useAuthStore((s) => s.user?.businessId);

  return useQuery({
    queryKey: CHANNELS_QUERY_KEY(businessId ?? ''),
    queryFn: () => channelsApi.list(businessId!),
    enabled: !!businessId,
  });
}

export function useSetAgentChannel(agentId: string) {
  const businessId = useAuthStore((s) => s.user?.businessId);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      previousChannelId,
      nextChannelId,
    }: {
      previousChannelId: string | null;
      nextChannelId: string | null;
    }) => {
      if (previousChannelId && previousChannelId !== nextChannelId) {
        await channelsApi.unassignAgent(businessId!, previousChannelId);
      }
      if (nextChannelId && nextChannelId !== previousChannelId) {
        await channelsApi.assignAgent(businessId!, nextChannelId, agentId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHANNELS_QUERY_KEY(businessId ?? '') });
    },
    onError: (error) => {
      toastManager.add({
        title: 'No se pudo actualizar el canal asignado',
        description: getApiErrorMessage(error),
        type: 'error',
      });
    },
  });
}
