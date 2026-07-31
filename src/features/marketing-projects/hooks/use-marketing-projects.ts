import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@features/auth/store/authStore';
import { marketingProjectsApi } from '@features/marketing-projects/api/marketing-projects.api';
import { ListMarketingProjectsParams } from '@features/marketing-projects/interfaces/marketing-project.interface';

export function useMarketingProjects(params: ListMarketingProjectsParams) {
  const businessId = useAuthStore((s) => s.user?.businessId);

  return useQuery({
    queryKey: ['marketing-projects', businessId, params],
    queryFn: () => marketingProjectsApi.list(businessId!, params),
    enabled: !!businessId,
  });
}
