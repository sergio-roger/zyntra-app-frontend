import { crmApi } from "@crm/api/crm.api";
import { useAuthStore } from "@features/auth/store/authStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const useEffectiveUserId = () => {
  const user = useAuthStore((s) => s.user);
  return user?.crm_user_id ?? user?.id ?? null;
};

export const preferenceKeys = {
  all: (userId: string | null) => ["user", "preferences", userId] as const,
  detail: (userId: string | null, key: string) =>
    ["user", "preferences", userId, key] as const,
};

export const useUserPreference = (key: string) => {
  const userId = useEffectiveUserId();
  return useQuery({
    queryKey: preferenceKeys.detail(userId, key),
    queryFn: async () => {
      const res = await crmApi.getUserPreference(key);
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!userId,
  });
};

export const useUpdateUserPreference = () => {
  const queryClient = useQueryClient();
  const userId = useEffectiveUserId();
  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: any }) => {
      const res = await crmApi.updateUserPreference(key, value);
      return res.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: preferenceKeys.detail(userId, variables.key),
      });
    },
  });
};
