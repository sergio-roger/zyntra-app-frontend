import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@features/auth/store/authStore';
import { contentPlanningApi } from '@features/content-planning/api/content-planning.api';

export function useContentPlans() {
  const businessId = useAuthStore((s) => s.user?.businessId);

  return useQuery({
    queryKey: ['content-plans', businessId],
    queryFn: () => contentPlanningApi.listPlans(businessId!),
    enabled: !!businessId,
  });
}
