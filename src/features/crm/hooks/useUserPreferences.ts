import { crmApi } from "@crm/api/crm.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const preferenceKeys = {
  all: ["user", "preferences"] as const,
  detail: (key: string) => ["user", "preferences", key] as const,
};

export const useUserPreference = (key: string) =>
  useQuery({
    queryKey: preferenceKeys.detail(key),
    queryFn: async () => {
      const res = await crmApi.getUserPreference(key);
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

export const useUpdateUserPreference = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: any }) => {
      const res = await crmApi.updateUserPreference(key, value);
      return res.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: preferenceKeys.detail(variables.key),
      });
    },
  });
};
