import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@features/auth/store/authStore';
import { toastManager } from '@shared/components/toast/toastManager';
import { getApiErrorMessage } from '@shared/constants/apiErrors';
import { marketingProjectsApi } from '@features/marketing-projects/api/marketing-projects.api';
import { UpdateMarketingProjectPayload } from '@features/marketing-projects/interfaces/marketing-project.interface';

export function useUpdateMarketingProject(id: string) {
  const businessId = useAuthStore((s) => s.user?.businessId);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateMarketingProjectPayload) => marketingProjectsApi.update(businessId!, id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketing-project-detail', businessId, id] });
      queryClient.invalidateQueries({ queryKey: ['marketing-projects', businessId] });
      queryClient.invalidateQueries({ queryKey: ['marketing-project-stats', businessId] });
    },
    onError: (error) => {
      toastManager.add({ title: 'No se pudo actualizar el proyecto', description: getApiErrorMessage(error), type: 'error' });
    },
  });
}
