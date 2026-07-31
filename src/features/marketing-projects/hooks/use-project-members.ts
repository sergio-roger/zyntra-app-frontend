import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@features/auth/store/authStore';
import { toastManager } from '@shared/components/toast/toastManager';
import { getApiErrorMessage } from '@shared/constants/apiErrors';
import { marketingProjectsApi } from '@features/marketing-projects/api/marketing-projects.api';
import { MarketingProjectMemberType } from '@features/marketing-projects/enums/marketing-project-member-type.enum';

export function useProjectMembers(id: string | undefined) {
  const businessId = useAuthStore((s) => s.user?.businessId);

  return useQuery({
    queryKey: ['marketing-project-members', businessId, id],
    queryFn: () => marketingProjectsApi.getMembers(businessId!, id!),
    enabled: !!businessId && !!id,
  });
}

export function useUpdateProjectMembers(id: string) {
  const businessId = useAuthStore((s) => s.user?.businessId);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (members: { memberType: MarketingProjectMemberType; memberId: string }[]) =>
      marketingProjectsApi.updateMembers(businessId!, id, members),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketing-project-members', businessId, id] });
    },
    onError: (error) => {
      toastManager.add({ title: 'No se pudo actualizar el equipo', description: getApiErrorMessage(error), type: 'error' });
    },
  });
}
