import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { dealsApi } from '@crm/api/deals.api';
import { pipelinesApi } from '@crm/api/pipelines.api';
import { ListDealsQuery, CreateDealInput, UpdateDealInput } from '@crm/types/crm';

export const pipelineKeys = {
  all: ['pipelines'] as const,
  list: () => ['pipelines', 'list'] as const,
  forecast: (id: string) => ['pipelines', 'forecast', id] as const,
};

export const dealsKeys = {
  all: ['deals'] as const,
  list: (query: ListDealsQuery) => ['deals', 'list', query] as const,
  detail: (id: string) => ['deals', 'detail', id] as const,
  kanban: (pipelineId: string) => ['deals', 'kanban', pipelineId] as const,
  history: (id: string) => ['deals', 'history', id] as const,
};

// ─── Pipelines ─────────────────────────────────────────────────────────────

export const usePipelines = () =>
  useQuery({
    queryKey: pipelineKeys.list(),
    queryFn: async () => {
      const res = await pipelinesApi.list();
      return res.data;
    },
  });

export const usePipelineForecast = (pipelineId: string | null) =>
  useQuery({
    enabled: Boolean(pipelineId),
    queryKey: pipelineKeys.forecast(pipelineId ?? ''),
    queryFn: async () => {
      const res = await pipelinesApi.forecast(pipelineId as string);
      return res.data;
    },
  });

export const useCreatePipeline = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: Parameters<typeof pipelinesApi.create>[0]) => {
      const res = await pipelinesApi.create(input);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: pipelineKeys.all });
    },
  });
};

export const useUpdatePipeline = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { id: string; input: Parameters<typeof pipelinesApi.update>[1] }) => {
      const res = await pipelinesApi.update(vars.id, vars.input);
      return res.data;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: pipelineKeys.all });
    },
  });
};

export const useDeletePipeline = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await pipelinesApi.remove(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: pipelineKeys.all });
    },
  });
};

// ─── Pipeline Stages ────────────────────────────────────────────────────────

export const useCreateStage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { pipelineId: string; input: Parameters<typeof pipelinesApi.createStage>[1] }) => {
      const res = await pipelinesApi.createStage(vars.pipelineId, vars.input);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: pipelineKeys.all }),
  });
};

export const useUpdateStage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { stageId: string; input: Parameters<typeof pipelinesApi.updateStage>[1] }) => {
      const res = await pipelinesApi.updateStage(vars.stageId, vars.input);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: pipelineKeys.all }),
  });
};

export const useDeleteStage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (stageId: string) => {
      await pipelinesApi.deleteStage(stageId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: pipelineKeys.all });
      qc.invalidateQueries({ queryKey: dealsKeys.all });
    },
  });
};

export const useReorderStages = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { pipelineId: string; stages: { id: string; position: number }[] }) => {
      const res = await pipelinesApi.reorderStages(vars.pipelineId, { stages: vars.stages });
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: pipelineKeys.all }),
  });
};

// ─── Deals Kanban ───────────────────────────────────────────────────────────

export const useDealsKanban = (pipelineId: string | null) =>
  useQuery({
    enabled: Boolean(pipelineId),
    queryKey: dealsKeys.kanban(pipelineId ?? ''),
    queryFn: async () => {
      const res = await dealsApi.kanban(pipelineId as string);
      return res.data;
    },
  });

// ─── Deals List ─────────────────────────────────────────────────────────────

export const useDealsList = (query: ListDealsQuery) =>
  useQuery({
    queryKey: dealsKeys.list(query),
    queryFn: async () => {
      const res = await dealsApi.list(query);
      return res.data;
    },
  });

export const useDeal = (id: string | null) =>
  useQuery({
    enabled: Boolean(id),
    queryKey: dealsKeys.detail(id ?? ''),
    queryFn: async () => {
      const res = await dealsApi.get(id as string);
      return res.data;
    },
  });

export const useDealHistory = (id: string | null) =>
  useQuery({
    enabled: Boolean(id),
    queryKey: dealsKeys.history(id ?? ''),
    queryFn: async () => {
      const res = await dealsApi.history(id as string);
      return res.data;
    },
  });

// ─── Mutations ──────────────────────────────────────────────────────────────

const invalidateDeals = (qc: ReturnType<typeof useQueryClient>) => {
  qc.invalidateQueries({ queryKey: dealsKeys.all });
};

export const useCreateDeal = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateDealInput) => {
      const res = await dealsApi.create(input);
      return res.data;
    },
    onSuccess: () => invalidateDeals(qc),
  });
};

export const useUpdateDeal = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { id: string; input: UpdateDealInput }) => {
      const res = await dealsApi.update(vars.id, vars.input);
      return res.data;
    },
    onSuccess: (_, vars) => {
      invalidateDeals(qc);
      qc.invalidateQueries({ queryKey: dealsKeys.detail(vars.id) });
    },
  });
};

export const useDeleteDeal = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await dealsApi.remove(id);
    },
    onSuccess: () => invalidateDeals(qc),
  });
};
