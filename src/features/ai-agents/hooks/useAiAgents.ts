import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@features/auth/store/authStore';
import { aiAgentsApi } from '../api/ai-agents.api';
import {
  CreateAgentPayload,
  UpdateAgentPayload,
} from '../types/ai-agents.types';

const useBusinessId = () => useAuthStore((s) => s.user?.businessId ?? '');

export const useAiAgents = () => {
  const businessId = useBusinessId();
  return useQuery({
    queryKey: ['ai-agents', businessId],
    queryFn: () => aiAgentsApi.list(businessId),
    enabled: !!businessId,
  });
};

export const useAiAgent = (agentId: string) => {
  const businessId = useBusinessId();
  return useQuery({
    queryKey: ['ai-agents', businessId, agentId],
    queryFn: () => aiAgentsApi.get(businessId, agentId),
    enabled: !!businessId && !!agentId,
  });
};

export const useCreateAiAgent = () => {
  const qc = useQueryClient();
  const businessId = useBusinessId();
  return useMutation({
    mutationFn: (payload: CreateAgentPayload) =>
      aiAgentsApi.create(businessId, payload),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['ai-agents', businessId] }),
  });
};

export const useUpdateAiAgent = (agentId: string) => {
  const qc = useQueryClient();
  const businessId = useBusinessId();
  return useMutation({
    mutationFn: (payload: UpdateAgentPayload) =>
      aiAgentsApi.update(businessId, agentId, payload),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['ai-agents', businessId] }),
  });
};

export const useDeleteAiAgent = () => {
  const qc = useQueryClient();
  const businessId = useBusinessId();
  return useMutation({
    mutationFn: (agentId: string) => aiAgentsApi.remove(businessId, agentId),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['ai-agents', businessId] }),
  });
};

export const useTestAiAgent = (agentId: string) => {
  const businessId = useBusinessId();
  return useMutation({
    mutationFn: (message: string) =>
      aiAgentsApi.test(businessId, agentId, message),
  });
};
