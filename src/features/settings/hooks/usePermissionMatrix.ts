import { useMenusList, useRolePermissions, useUpdatePermissions } from '@features/settings/hooks/usePermissions';
import { toastManager } from '@shared/components/toast/toastManager';
import { Menu } from '@features/settings/types/settings';

interface UsePermissionMatrixParams {
  roleKey: string;
  readOnly?: boolean;
}

type ToggleStrategy = (menu: Menu, allMenus: Menu[], currentIds: string[]) => string[];

const toggleStrategies: Record<'check' | 'uncheck', ToggleStrategy> = {
  check: (menu, allMenus, currentIds) => {
    const nextIds = new Set(currentIds);
    nextIds.add(menu.id);

    if (menu.parent_key) {
      const parent = allMenus.find((m) => m.key === menu.parent_key);
      if (parent) nextIds.add(parent.id);
    } else {
      const children = allMenus.filter((m) => m.parent_key === menu.key);
      children.forEach((c) => nextIds.add(c.id));
    }
    return Array.from(nextIds);
  },
  uncheck: (menu, allMenus, currentIds) => {
    const nextIds = new Set(currentIds);
    nextIds.delete(menu.id);

    if (!menu.parent_key) {
      const children = allMenus.filter((m) => m.parent_key === menu.key);
      children.forEach((c) => nextIds.delete(c.id));
    }
    return Array.from(nextIds);
  },
};

export function usePermissionMatrix({ roleKey, readOnly = false }: UsePermissionMatrixParams) {
  const { data: allMenus, isLoading: loadingMenus } = useMenusList();
  const { data: rolePerms, isLoading: loadingPerms } = useRolePermissions(roleKey);
  const updateMutation = useUpdatePermissions(roleKey);

  const isLoading = loadingMenus || loadingPerms;
  const activeMenuIds = rolePerms?.menu_ids || [];
  const roots = allMenus ? allMenus.filter((m) => m.parent_key === null) : [];

  const handleToggle = (menuId: string, checked: boolean) => {
    if (readOnly || !allMenus) return;

    const menu = allMenus.find((m) => m.id === menuId);
    if (!menu) return;

    const strategyKey = checked ? 'check' : 'uncheck';
    const nextIds = toggleStrategies[strategyKey](menu, allMenus, activeMenuIds);

    updateMutation.mutate(nextIds, {
      onError: () => {
        toastManager.add({
          title: 'Error al actualizar permisos',
          description: 'No se pudo guardar la configuración. Intenta de nuevo.',
          type: 'error',
        });
      },
    });
  };

  return {
    isLoading,
    allMenus,
    rolePerms,
    roots,
    activeMenuIds,
    handleToggle,
    isUpdating: updateMutation.isPending,
    updatingVariables: updateMutation.variables,
  };
}
