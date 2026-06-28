import {
  CreateContactInput,
  crmApi,
  UpdateContactInput,
} from '@crm/api/crm.api';
import { ContactsListResponse } from '@crm/types/contacts-list-response';
import { ListContactsQuery } from '@crm/types/list-contacts-query';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const contactsKeys = {
  all: ['contacts'] as const,
  list: (query: ListContactsQuery) => ['contacts', 'list', query] as const,
  detail: (id: string) => ['contacts', 'detail', id] as const,
  activities: (id: string) => ['contacts', id, 'activities'] as const,
};

export const useContactsList = (
  query: ListContactsQuery,
  options?: { enabled?: boolean },
) =>
  useQuery({
    queryKey: contactsKeys.list(query),
    queryFn: async () => {
      const res = await crmApi.list(query);
      return res.data as ContactsListResponse;
    },
    enabled: options?.enabled ?? true,
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
