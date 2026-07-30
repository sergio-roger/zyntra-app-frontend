import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@features/auth/store/authStore';
import { contentPlanningApi } from '@features/content-planning/api/content-planning.api';

export function useContentPlanDetail(planId: string | undefined) {
  const businessId = useAuthStore((s) => s.user?.businessId);

  return useQuery({
    queryKey: ['content-plan-detail', businessId, planId],
    queryFn: () => contentPlanningApi.getPlanDetail(businessId!, planId!),
    enabled: !!businessId && !!planId,
  });
}
