import { crmApi } from '@crm/api/crm.api';
import { CrmMember } from '@crm/types/crm-member';
import { useQuery } from '@tanstack/react-query';

export const useCrmMembers = (options?: { enabled?: boolean }) => {
  return useQuery<CrmMember[]>({
    queryKey: ['crm-members'],
    queryFn: () => crmApi.listMembers().then((r) => r.data),
    staleTime: 5 * 60 * 1000,
    enabled: options?.enabled ?? true,
  });
};
