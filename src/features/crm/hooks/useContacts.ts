import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { crmApi, CreateContactInput, UpdateContactInput } from '@crm/api/crm.api';
import { ContactsListResponse, ListContactsQuery, Pipeline } from '@crm/types';

export const contactsKeys = {
  all: ['contacts'] as const,
  list: (query: ListContactsQuery) => ['contacts', 'list', query] as const,
  detail: (id: string) => ['contacts', 'detail', id] as const,
  activities: (id: string) => ['contacts', id, 'activities'] as const,
  pipeline: ['pipeline'] as const,
  kanban: ['contacts', 'kanban'] as const,
};

export const useContactsList = (query: ListContactsQuery) =>
  useQuery({
    queryKey: contactsKeys.list(query),
    queryFn: async () => {
      const res = await crmApi.list(query);
      return res.data as ContactsListResponse;
    },
  });

export const usePipeline = () =>
  useQuery({
    queryKey: contactsKeys.pipeline,
    queryFn: async () => {
      const res = await crmApi.pipeline();
      return res.data as Pipeline;
    },
  });

export const useKanban = () =>
  useQuery({
    queryKey: contactsKeys.kanban,
    queryFn: async () => {
      const res = await crmApi.kanban();
      return res.data;
    },
  });

export const useContact = (id: string | null) =>
  useQuery({
    enabled: Boolean(id),
    queryKey: contactsKeys.detail(id ?? ''),
    queryFn: async () => {
      const res = await crmApi.get(id as string);
      return res.data;
    },
  });

export const useContactActivities = (id: string | null) =>
  useQuery({
    enabled: Boolean(id),
    queryKey: contactsKeys.activities(id ?? ''),
    queryFn: async () => {
      const res = await crmApi.listActivities(id as string);
      return res.data;
    },
  });

const invalidateLists = (qc: ReturnType<typeof useQueryClient>) => {
  qc.invalidateQueries({ queryKey: contactsKeys.all });
  qc.invalidateQueries({ queryKey: contactsKeys.pipeline });
};

export const useCreateContact = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateContactInput) => {
      const res = await crmApi.create(input);
      return res.data;
    },
    onSuccess: () => invalidateLists(qc),
  });
};

export const useUpdateContact = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { id: string; input: UpdateContactInput }) => {
      const res = await crmApi.update(vars.id, vars.input);
      return res.data;
    },
    onSuccess: (_, vars) => {
      invalidateLists(qc);
      qc.invalidateQueries({ queryKey: contactsKeys.detail(vars.id) });
      qc.invalidateQueries({ queryKey: contactsKeys.activities(vars.id) });
    },
  });
};

export const useDeleteContact = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await crmApi.remove(id);
    },
    onSuccess: () => invalidateLists(qc),
  });
};
