import { useQuery } from '@tanstack/react-query';
import { aiApi, ConversationFilters } from '../api/aiApi';

export const useConversations = (filters: ConversationFilters = {}) =>
  useQuery({
    queryKey: ['conversations', filters],
    queryFn: () => aiApi.getConversations(filters),
    // El socket (/chat gateway) mantiene la lista al día en tiempo real.
    refetchOnWindowFocus: false,
  });
