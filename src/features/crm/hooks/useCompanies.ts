import {
  CreateCompanyInput,
  UpdateCompanyInput,
  companiesApi,
} from '@crm/api/companies.api';
import { ListCompaniesQuery } from '@crm/types/company';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const companiesKeys = {
  all: ['companies'] as const,
  list: (query: ListCompaniesQuery) => ['companies', 'list', query] as const,
  detail: (id: string) => ['companies', 'detail', id] as const,
  industries: ['companies', 'industries'] as const,
};

const invalidateLists = (qc: ReturnType<typeof useQueryClient>) => {
  qc.invalidateQueries({ queryKey: companiesKeys.all });
};

export const useCompaniesList = (
  query: ListCompaniesQuery,
  options?: { enabled?: boolean },
) =>
  useQuery({
    queryKey: companiesKeys.list(query),
    queryFn: async () => {
      const res = await companiesApi.list(query);
      return res.data;
    },
    enabled: options?.enabled ?? true,
  });

export const useCompany = (id: string | null) =>
  useQuery({
    enabled: Boolean(id),
    queryKey: companiesKeys.detail(id ?? ''),
    queryFn: async () => {
      const res = await companiesApi.get(id as string);
      return res.data;
    },
  });

export const useIndustrys = () =>
  useQuery({
    queryKey: companiesKeys.industries,
    queryFn: async () => {
      const res = await companiesApi.listIndustries();
      return Array.isArray(res?.data) ? res.data : [];
    },
    staleTime: 10 * 60 * 1000,
  });

export const useCreateCompany = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateCompanyInput) => {
      const res = await companiesApi.create(input);
      return res.data;
    },
    onSuccess: () => invalidateLists(qc),
  });
};

export const useUpdateCompany = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { id: string; input: UpdateCompanyInput }) => {
      const res = await companiesApi.update(vars.id, vars.input);
      return res.data;
    },
    onSuccess: (_, vars) => {
      invalidateLists(qc);
      qc.invalidateQueries({ queryKey: companiesKeys.detail(vars.id) });
    },
  });
};

export const useDeleteCompany = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await companiesApi.remove(id);
    },
    onSuccess: () => invalidateLists(qc),
  });
};
