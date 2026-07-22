import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@features/auth/store/authStore';
import { channelsApi } from '@features/channels/api/channels.api';

const CHANNELS_QUERY_KEY = (businessId: string) => ['automations-channels', businessId];

// Solo lectura: la asignación agente↔canal se maneja del lado de Canales
// (wizard StepAgent.tsx / ChannelDetailPage.tsx), no acá.
export function useChannelsList() {
  const businessId = useAuthStore((s) => s.user?.businessId);

  return useQuery({
    queryKey: CHANNELS_QUERY_KEY(businessId ?? ''),
    queryFn: () => channelsApi.list(businessId!),
    enabled: !!businessId,
  });
}
