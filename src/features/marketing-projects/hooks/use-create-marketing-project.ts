import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@features/auth/store/authStore';
import { toastManager } from '@shared/components/toast/toastManager';
import { getApiErrorMessage } from '@shared/constants/apiErrors';
import { marketingProjectsApi } from '@features/marketing-projects/api/marketing-projects.api';
import { CreateMarketingProjectPayload } from '@features/marketing-projects/interfaces/marketing-project.interface';

export function useCreateMarketingProject() {
  const businessId = useAuthStore((s) => s.user?.businessId);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateMarketingProjectPayload) => marketingProjectsApi.create(businessId!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketing-projects', businessId] });
      queryClient.invalidateQueries({ queryKey: ['marketing-project-stats', businessId] });
      toastManager.add({ title: 'Proyecto creado', type: 'success' });
    },
    onError: (error) => {
      toastManager.add({ title: 'No se pudo crear el proyecto', description: getApiErrorMessage(error), type: 'error' });
    },
  });
}
