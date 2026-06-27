import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { leadsApi, ListLeadsQuery } from '@crm/api/leads.api';
import { ConvertToDealInput } from '@crm/types/convert-to-deal-input';

export const leadsKeys = {
  all: ['leads'] as const,
  list: (query: ListLeadsQuery) => ['leads', 'list', query] as const,
};

export const useLeadsList = (query: ListLeadsQuery = {}) =>
  useQuery({
    queryKey: leadsKeys.list(query),
    queryFn: async () => {
      const res = await leadsApi.list(query);
      return res.data;
    },
  });

const invalidateLeads = (qc: ReturnType<typeof useQueryClient>) => {
  qc.invalidateQueries({ queryKey: leadsKeys.all });
};

export const useArchiveLead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => leadsApi.archive(id),
    onSuccess: () => invalidateLeads(qc),
  });
};

export const useConvertToDeal = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ConvertToDealInput }) =>
      leadsApi.convertToDeal(id, input),
    onSuccess: () => {
      invalidateLeads(qc);
      qc.invalidateQueries({ queryKey: ['deals'] });
    },
  });
};
