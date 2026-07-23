import { businessProfileApi } from '@features/settings/api/businessProfileApi';
import { UpdateBusinessProfileInput } from '@features/settings/types/business-profile.types';
import { toastManager } from '@shared/components/toast/toastManager';
import { getApiErrorMessage } from '@shared/constants/apiErrors';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const BUSINESS_PROFILE_QUERY_KEY = ['settings-business-profile'];

export function useBusinessProfileQuery() {
  return useQuery({
    queryKey: BUSINESS_PROFILE_QUERY_KEY,
    queryFn: async () => (await businessProfileApi.get()).data,
  });
}

export function useUpdateBusinessProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateBusinessProfileInput) =>
      businessProfileApi.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BUSINESS_PROFILE_QUERY_KEY });
      toastManager.add({
        title: 'Perfil de negocio actualizado',
        description: 'Los cambios se guardaron correctamente.',
        type: 'success',
      });
    },
    onError: (error) => {
      toastManager.add({
        title: 'Error al actualizar el perfil de negocio',
        description: getApiErrorMessage(error),
        type: 'error',
      });
    },
  });
}
