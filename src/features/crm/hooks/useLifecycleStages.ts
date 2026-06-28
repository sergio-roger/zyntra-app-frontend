import { useQuery } from '@tanstack/react-query';
import { LifecycleStage } from '@crm/types/lifecycle-stage';
import api from '@shared/api/axios';

export const useLifecycleStages = () => {
  return useQuery<LifecycleStage[]>({
    queryKey: ['lifecycle-stages'],
    queryFn: async () => {
      const res: any = await api.get('/lifecycle/stages');
      const data = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};
