import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { dealsApi } from '@crm/api/deals.api';
import { Deal, ListDealsQuery, DealStage } from '@crm/types';

export const dealsKeys = {
  all: ['deals'] as const,
  list: (query: ListDealsQuery) => ['deals', 'list', query] as const,
  detail: (id: string) => ['deals', 'detail', id] as const,
  kanban: ['deals', 'kanban'] as const,
};

export const useDealsList = (query: ListDealsQuery) =>
  useQuery({
    queryKey: dealsKeys.list(query),
    queryFn: async () => {
      const res = await dealsApi.list(query);
      return res.data;
    },
  });

export const useDealsKanban = () =>
  useQuery({
    queryKey: dealsKeys.kanban,
    queryFn: async () => {
      const res = await dealsApi.kanban();
      return res.data as Record<DealStage, Deal[]>;
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

const invalidateDeals = (qc: ReturnType<typeof useQueryClient>) => {
  qc.invalidateQueries({ queryKey: dealsKeys.all });
};

export const useCreateDeal = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: Partial<Deal>) => {
      const res = await dealsApi.create(input);
      return res.data;
    },
    onSuccess: () => invalidateDeals(qc),
  });
};

export const useUpdateDeal = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { id: string; input: Partial<Deal> }) => {
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
