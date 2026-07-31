import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@features/auth/store/authStore';
import { marketingProjectsApi } from '@features/marketing-projects/api/marketing-projects.api';

export function useMarketingProjectStats() {
  const businessId = useAuthStore((s) => s.user?.businessId);

  return useQuery({
    queryKey: ['marketing-project-stats', businessId],
    queryFn: () => marketingProjectsApi.getStats(businessId!),
    enabled: !!businessId,
  });
}
