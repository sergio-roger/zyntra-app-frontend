import { useQuery } from '@tanstack/react-query';
import { aiApi } from '../api/aiApi';

export const useConversationDetail = (id: string | null) =>
  useQuery({
    queryKey: ['conversations', 'detail', id],
    queryFn: () => aiApi.getConversationDetail(id as string),
    enabled: !!id,
  });
