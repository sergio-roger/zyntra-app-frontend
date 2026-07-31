import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@features/auth/store/authStore';
import { toastManager } from '@shared/components/toast/toastManager';
import { getApiErrorMessage } from '@shared/constants/apiErrors';
import { marketingProjectsApi } from '@features/marketing-projects/api/marketing-projects.api';

export function useDeleteMarketingProject() {
  const businessId = useAuthStore((s) => s.user?.businessId);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => marketingProjectsApi.remove(businessId!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketing-projects', businessId] });
      queryClient.invalidateQueries({ queryKey: ['marketing-project-stats', businessId] });
      toastManager.add({ title: 'Proyecto eliminado', type: 'success' });
    },
    onError: (error) => {
      toastManager.add({ title: 'No se pudo eliminar el proyecto', description: getApiErrorMessage(error), type: 'error' });
    },
  });
}
