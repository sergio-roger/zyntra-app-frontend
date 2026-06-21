import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@shared/api/axios';
import { RolePermissions, Menu } from '../types';

export function useMenusList() {
  return useQuery<Menu[]>({
    queryKey: ['settings-menus'],
    queryFn: async () => {
      const { data } = await api.get('/settings/menus');
      return data;
    },
  });
}

export function useRolePermissions(roleName: string) {
  return useQuery<RolePermissions>({
    queryKey: ['settings-permissions', roleName],
    queryFn: async () => {
      const { data } = await api.get(`/settings/permissions/${roleName}`);
      return data;
    },
    enabled: !!roleName,
  });
}

export function useUpdatePermissions(roleName: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (menu_ids: string[]) => {
      const { data } = await api.put(`/settings/permissions/${roleName}`, { menu_ids });
      return data;
    },
    onMutate: async (menu_ids) => {
      await queryClient.cancelQueries({ queryKey: ['settings-permissions', roleName] });
      const prev = queryClient.getQueryData<RolePermissions>(['settings-permissions', roleName]);
      queryClient.setQueryData(['settings-permissions', roleName], { role: roleName, menu_ids });
      return { prev };
    },
    onError: (_err, _vars, context) => {
      if (context?.prev) {
        queryClient.setQueryData(['settings-permissions', roleName], context.prev);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['settings-permissions', roleName] });
    },
  });
}
