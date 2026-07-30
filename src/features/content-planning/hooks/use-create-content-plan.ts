import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@features/auth/store/authStore';
import { toastManager } from '@shared/components/toast/toastManager';
import { getApiErrorMessage } from '@shared/constants/apiErrors';
import { contentPlanningApi } from '@features/content-planning/api/content-planning.api';
import { CreateContentPlanPayload } from '@features/content-planning/interfaces/content-plan.interface';

export function useCreateContentPlan() {
  const businessId = useAuthStore((s) => s.user?.businessId);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateContentPlanPayload) =>
      contentPlanningApi.createPlan(businessId!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-plans', businessId] });
      toastManager.add({ title: 'Plan de contenido creado', type: 'success' });
    },
    onError: (error) => {
      toastManager.add({
        title: 'No se pudo crear el plan',
        description: getApiErrorMessage(error),
        type: 'error',
      });
    },
  });
}
