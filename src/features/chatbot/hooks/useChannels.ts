import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@features/auth/store/authStore';
import { aiApi } from '../api/aiApi';

export const useChannels = () => {
  const businessId = useAuthStore((s) => s.user?.businessId ?? '');

  return useQuery({
    queryKey: ['channels', businessId],
    queryFn: () => aiApi.getChannels(businessId),
    enabled: !!businessId,
    // Los canales cambian poco — evita refetch constante en el filtro de conversaciones.
    staleTime: 10 * 60 * 1000,
  });
};
