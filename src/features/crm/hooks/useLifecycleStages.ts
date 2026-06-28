import { useQuery } from '@tanstack/react-query';
import api from '@shared/api/axios';

export interface LifecycleStage {
  color?: string;
  description?: string;
  id: string;
  name: string;
}

export const useLifecycleStages = () => {
  return useQuery<LifecycleStage[]>({
    queryKey: ['lifecycle-stages'],
    queryFn: async () => {
      const { data } = await api.get('/lifecycle/stages');
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};
