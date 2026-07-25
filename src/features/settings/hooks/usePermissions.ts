import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@shared/api/axios';
import { RolePermissions, Menu, Role } from '../types/settings';

export function useRolesList() {
  return useQuery<Role[]>({
    queryKey: ['settings-roles'],
    queryFn: async () => {
      const { data } = await api.get('/settings/roles');
      return data;
    },
  });
}

export function useCreateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newRole: {
      name: string;
      label: string;
      description?: string;
      badge?: string;
      badgeColor?: string;
      iconColor?: string;
    }) => {
      const { data } = await api.post('/settings/roles', newRole);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings-roles'] });
    },
  });
}

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
    mutationFn: async (menuIds: string[]) => {
      const { data } = await api.put(`/settings/permissions/${roleName}`, {
        menuIds,
      });
      return data;
    },
    onMutate: async (menuIds) => {
      await queryClient.cancelQueries({
        queryKey: ['settings-permissions', roleName],
      });
      const prev = queryClient.getQueryData<RolePermissions>([
        'settings-permissions',
        roleName,
      ]);
      queryClient.setQueryData(['settings-permissions', roleName], {
        role: roleName,
        menuIds,
      });
      return { prev };
    },
    onError: (_err, _vars, context) => {
      if (context?.prev) {
        queryClient.setQueryData(
          ['settings-permissions', roleName],
          context.prev,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['settings-permissions', roleName],
      });
    },
  });
}

export function useUpdateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      roleName,
      data: updatedRole,
    }: {
      roleName: string;
      data: {
        label: string;
        description?: string;
        badge?: string;
        badgeColor?: string;
        iconColor?: string;
      };
    }) => {
      const { data } = await api.put(
        `/settings/roles/${roleName}`,
        updatedRole,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings-roles'] });
    },
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (roleName: string) => {
      const { data } = await api.delete(`/settings/roles/${roleName}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings-roles'] });
    },
  });
}
