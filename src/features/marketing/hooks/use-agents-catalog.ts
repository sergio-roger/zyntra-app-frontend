import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@features/auth/store/authStore';
import { agentsApi } from '../api/agents.api';
import { WorkflowRunStatus } from '../types/agents';

const useBusinessId = () => useAuthStore((s) => s.user?.businessId ?? '');

export const useSystemAgentsCatalog = () =>
  useQuery({
    queryKey: ['system-agents-catalog'],
    queryFn: agentsApi.getCatalog,
  });

export const useImportedAgents = () => {
  const businessId = useBusinessId();
  return useQuery({
    queryKey: ['imported-system-agents', businessId],
    queryFn: () => agentsApi.getImportedAgents(businessId),
    enabled: !!businessId,
  });
};

export const useImportAgent = () => {
  const businessId = useBusinessId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (systemAgentId: string) =>
      agentsApi.importAgent(businessId, systemAgentId),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['imported-system-agents', businessId] }),
  });
};

export const useTriggerOrchestratorRun = () => {
  const businessId = useBusinessId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (goal: string) => agentsApi.triggerRun(businessId, goal),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['orchestrator-run', businessId] }),
  });
};

const RUN_IN_PROGRESS: WorkflowRunStatus[] = ['pending', 'running'];

export const useOrchestratorRun = (runId: string | null) => {
  const businessId = useBusinessId();
  return useQuery({
    queryKey: ['orchestrator-run', businessId, runId],
    queryFn: () => agentsApi.getRun(businessId, runId as string),
    enabled: !!businessId && !!runId,
    refetchInterval: (query) =>
      query.state.data && !RUN_IN_PROGRESS.includes(query.state.data.status)
        ? false
        : 1500,
  });
};
