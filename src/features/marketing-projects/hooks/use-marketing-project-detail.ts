import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@features/auth/store/authStore';
import { marketingProjectsApi } from '@features/marketing-projects/api/marketing-projects.api';

export function useMarketingProjectDetail(id: string | undefined) {
  const businessId = useAuthStore((s) => s.user?.businessId);

  return useQuery({
    queryKey: ['marketing-project-detail', businessId, id],
    queryFn: () => marketingProjectsApi.getById(businessId!, id!),
    enabled: !!businessId && !!id,
  });
}
