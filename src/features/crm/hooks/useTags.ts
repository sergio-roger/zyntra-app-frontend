import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { crmApi } from "@crm/api/crm.api";

export const tagsKeys = {
  all: ["crm", "tags"] as const,
};

export const useTags = () =>
  useQuery({
    queryKey: tagsKeys.all,
    queryFn: async () => {
      const res = await crmApi.listTags();
      return res.data;
    },
  });

export const useCreateTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      name: string;
      color?: string;
      description?: string;
    }) => crmApi.createTag(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagsKeys.all });
    },
  });
};

export const useUpdateTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...input
    }: {
      id: string;
      name?: string;
      color?: string;
      description?: string;
    }) => crmApi.updateTag(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagsKeys.all });
    },
  });
};

export const useRemoveTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => crmApi.removeTag(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagsKeys.all });
    },
  });
};
