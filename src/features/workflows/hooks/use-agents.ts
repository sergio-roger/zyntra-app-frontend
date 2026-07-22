import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@features/auth/store/authStore';
import { toastManager } from '@shared/components/toast/toastManager';
import { getApiErrorMessage } from '@shared/constants/apiErrors';
import { agentsApi } from '../api/agents.api';
import { CreateAgentPayload, UpdateAgentPayload } from '../types/automations';

const AGENTS_QUERY_KEY = (businessId: string) => ['automations-agents', businessId];
const AGENT_QUERY_KEY = (businessId: string, agentId: string) => [
  'automations-agents',
  businessId,
  agentId,
];

export function useAgentsList() {
  const businessId = useAuthStore((s) => s.user?.businessId);

  return useQuery({
    queryKey: AGENTS_QUERY_KEY(businessId ?? ''),
    queryFn: () => agentsApi.list(businessId!),
    enabled: !!businessId,
  });
}

export function useAgent(agentId: string | undefined) {
  const businessId = useAuthStore((s) => s.user?.businessId);

  return useQuery({
    queryKey: AGENT_QUERY_KEY(businessId ?? '', agentId ?? ''),
    queryFn: () => agentsApi.get(businessId!, agentId!),
    enabled: !!businessId && !!agentId,
  });
}

export function useCreateAgent() {
  const businessId = useAuthStore((s) => s.user?.businessId);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAgentPayload) =>
      agentsApi.create(businessId!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AGENTS_QUERY_KEY(businessId ?? '') });
      toastManager.add({
        title: 'Agente creado',
        description: 'El agente se creó correctamente.',
        type: 'success',
      });
    },
    onError: (error) => {
      toastManager.add({
        title: 'Error al crear el agente',
        description: getApiErrorMessage(error),
        type: 'error',
      });
    },
  });
}

export function useUpdateAgent(agentId: string) {
  const businessId = useAuthStore((s) => s.user?.businessId);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateAgentPayload) =>
      agentsApi.update(businessId!, agentId, payload),
    onSuccess: (agent) => {
      queryClient.invalidateQueries({ queryKey: AGENTS_QUERY_KEY(businessId ?? '') });
      queryClient.setQueryData(AGENT_QUERY_KEY(businessId ?? '', agentId), agent);
      toastManager.add({
        title: 'Agente actualizado',
        description: 'Los cambios se guardaron correctamente.',
        type: 'success',
      });
    },
    onError: (error) => {
      toastManager.add({
        title: 'Error al actualizar el agente',
        description: getApiErrorMessage(error),
        type: 'error',
      });
    },
  });
}

export function useDeleteAgent() {
  const businessId = useAuthStore((s) => s.user?.businessId);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (agentId: string) => agentsApi.remove(businessId!, agentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AGENTS_QUERY_KEY(businessId ?? '') });
      toastManager.add({
        title: 'Agente eliminado',
        description: 'El agente se eliminó correctamente.',
        type: 'success',
      });
    },
    onError: (error) => {
      toastManager.add({
        title: 'No se pudo eliminar el agente',
        description: getApiErrorMessage(error),
        type: 'error',
      });
    },
  });
}

export function useTestAgent(agentId: string) {
  const businessId = useAuthStore((s) => s.user?.businessId);

  return useMutation({
    mutationFn: (message: string) => agentsApi.test(businessId!, agentId, message),
    onError: (error) => {
      toastManager.add({
        title: 'Error al probar el agente',
        description: getApiErrorMessage(error),
        type: 'error',
      });
    },
  });
}
