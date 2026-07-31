import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@features/auth/store/authStore';
import { marketingProjectsApi } from '@features/marketing-projects/api/marketing-projects.api';

export function useProjectContentPlan(id: string | undefined) {
  const businessId = useAuthStore((s) => s.user?.businessId);

  return useQuery({
    queryKey: ['marketing-project-content-plan', businessId, id],
    queryFn: () => marketingProjectsApi.getContentPlan(businessId!, id!),
    enabled: !!businessId && !!id,
  });
}
