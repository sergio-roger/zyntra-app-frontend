import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@features/auth/store/authStore';
import { toastManager } from '@shared/components/toast/toastManager';
import { getApiErrorMessage } from '@shared/constants/apiErrors';
import { contentPlanningApi } from '@features/content-planning/api/content-planning.api';

export function useRegenerateCopy() {
  const businessId = useAuthStore((s) => s.user?.businessId);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, instruction }: { postId: string; instruction?: string }) =>
      contentPlanningApi.regenerateCopy(businessId!, postId, instruction),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-plans', businessId] });
    },
    onError: (error) => {
      toastManager.add({
        title: 'No se pudo regenerar el copy',
        description: getApiErrorMessage(error),
        type: 'error',
      });
    },
  });
}
