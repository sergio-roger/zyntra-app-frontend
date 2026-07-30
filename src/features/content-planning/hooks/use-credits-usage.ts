import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@features/auth/store/authStore';
import { contentPlanningApi } from '@features/content-planning/api/content-planning.api';

export function useCreditsUsage() {
  const businessId = useAuthStore((s) => s.user?.businessId);

  return useQuery({
    queryKey: ['content-generation-credits-usage', businessId],
    queryFn: () => contentPlanningApi.getCreditsUsage(businessId!),
    enabled: !!businessId,
  });
}
