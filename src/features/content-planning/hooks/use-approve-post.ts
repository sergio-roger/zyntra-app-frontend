import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@features/auth/store/authStore';
import { toastManager } from '@shared/components/toast/toastManager';
import { getApiErrorMessage } from '@shared/constants/apiErrors';
import { contentPlanningApi } from '@features/content-planning/api/content-planning.api';

export function useApprovePost() {
  const businessId = useAuthStore((s) => s.user?.businessId);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => contentPlanningApi.approvePost(businessId!, postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-plan-detail', businessId] });
    },
    onError: (error) => {
      toastManager.add({
        title: 'No se pudo aprobar el post',
        description: getApiErrorMessage(error),
        type: 'error',
      });
    },
  });
}
