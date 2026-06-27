import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { crmApi } from "@crm/api/crm.api";

export const fieldsKeys = {
  all: ["crm", "fields"] as const,
};

export const useCustomFields = () =>
  useQuery({
    queryKey: fieldsKeys.all,
    queryFn: async () => {
      const res = await crmApi.listFields();
      return res.data;
    },
  });

export const useCreateField = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      name: string;
      label: string;
      type: string;
      options?: string[];
      required?: boolean;
    }) => crmApi.createField(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fieldsKeys.all });
    },
  });
};

export const useUpdateField = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...input
    }: {
      id: string;
      label?: string;
      options?: string[];
      required?: boolean;
      is_active?: boolean;
    }) => crmApi.updateField(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fieldsKeys.all });
    },
  });
};

export const useRemoveField = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => crmApi.removeField(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fieldsKeys.all });
    },
  });
};
