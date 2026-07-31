import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@features/auth/store/authStore';
import { toastManager } from '@shared/components/toast/toastManager';
import { getApiErrorMessage } from '@shared/constants/apiErrors';
import { marketingProjectsApi } from '@features/marketing-projects/api/marketing-projects.api';

export function useUploadProjectCover(id: string) {
  const businessId = useAuthStore((s) => s.user?.businessId);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => marketingProjectsApi.uploadCover(businessId!, id, file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['marketing-project-detail', businessId, id] }),
    onError: (error) => {
      toastManager.add({ title: 'No se pudo subir la portada', description: getApiErrorMessage(error), type: 'error' });
    },
  });
}

export function useGenerateProjectCover(id: string) {
  const businessId = useAuthStore((s) => s.user?.businessId);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (prompt: string) => marketingProjectsApi.generateCover(businessId!, id, prompt),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['marketing-project-detail', businessId, id] }),
    onError: (error) => {
      toastManager.add({ title: 'No se pudo generar la portada', description: getApiErrorMessage(error), type: 'error' });
    },
  });
}
