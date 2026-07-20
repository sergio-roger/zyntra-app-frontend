import { useQuery } from '@tanstack/react-query';
import { aiApi } from '../api/aiApi';

/** Usuarios del negocio disponibles para asignarles una conversación. */
export const useAssignableUsers = (enabled = true) => {
  return useQuery({
    queryKey: ['chat-assignable-users'],
    queryFn: () => aiApi.getAssignableUsers(),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
};
