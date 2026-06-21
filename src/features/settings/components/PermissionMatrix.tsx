import React from 'react';
import { useMenusList, useRolePermissions, useUpdatePermissions } from '../hooks/usePermissions';
import { PermissionToggle } from './PermissionToggle';
import { toastManager } from '@shared/components/toast/toastManager';
import { Loader2 } from 'lucide-react';

interface PermissionMatrixProps {
  roleKey: 'manager' | 'agent';
  readOnly?: boolean;
}

export const PermissionMatrix: React.FC<PermissionMatrixProps> = ({ roleKey, readOnly = false }) => {
  const { data: allMenus, isLoading: loadingMenus } = useMenusList();
  const { data: rolePerms, isLoading: loadingPerms } = useRolePermissions(roleKey);
  const updateMutation = useUpdatePermissions(roleKey);

  const isLoading = loadingMenus || loadingPerms;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-400">
        <Loader2 className="animate-spin text-indigo-500" size={32} />
        <span>Cargando matriz de permisos...</span>
      </div>
    );
  }

  if (!allMenus || !rolePerms) {
    return (
      <div className="text-center py-12 text-slate-400">
        Error al cargar la información de permisos.
      </div>
    );
  }

  const activeMenuIds = rolePerms.menu_ids;

  // Group menus: parent_key === null are roots
  const roots = allMenus.filter((m) => m.parent_key === null);

  const handleToggle = (menuId: string, checked: boolean) => {
    if (readOnly) return;

    let nextIds = [...activeMenuIds];
    const menu = allMenus.find((m) => m.id === menuId);
    if (!menu) return;

    if (checked) {
      // Add current menu
      if (!nextIds.includes(menu.id)) nextIds.push(menu.id);
      // If it has a parent, also add the parent
      if (menu.parent_key) {
        const parent = allMenus.find((m) => m.key === menu.parent_key);
        if (parent && !nextIds.includes(parent.id)) {
          nextIds.push(parent.id);
        }
      } else {
        // If it's a parent, also add all its children
        const children = allMenus.filter((m) => m.parent_key === menu.key);
        children.forEach((c) => {
          if (!nextIds.includes(c.id)) nextIds.push(c.id);
        });
      }
    } else {
      // Remove current menu
      nextIds = nextIds.filter((id) => id !== menu.id);
      // If it's a parent, also remove all its children
      if (!menu.parent_key) {
        const children = allMenus.filter((m) => m.parent_key === menu.key);
        const childrenIds = children.map((c) => c.id);
        nextIds = nextIds.filter((id) => !childrenIds.includes(id));
      }
    }

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

  return (
    <div className="space-y-8">
      {roots.map((root) => {
        const children = allMenus.filter((m) => m.parent_key === root.key);
        const isRootChecked = activeMenuIds.includes(root.id);

        return (
          <div key={root.id} className="bg-slate-900 border border-white/5 rounded-2xl p-6 space-y-4">
            {/* Parent Module Header */}
            <div>
              <PermissionToggle
                menuId={root.id}
                label={root.label}
                checked={isRootChecked}
                disabled={readOnly}
                onChange={(val) => handleToggle(root.id, val)}
                isPending={updateMutation.isPending && updateMutation.variables?.includes(root.id) !== isRootChecked}
              />
            </div>

            {/* Submenus Grid */}
            {children.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6 border-l border-white/5">
                {children.map((child) => {
                  const isChildChecked = activeMenuIds.includes(child.id);

                  return (
                    <PermissionToggle
                      key={child.id}
                      menuId={child.id}
                      label={child.label}
                      checked={isChildChecked}
                      disabled={readOnly}
                      onChange={(val) => handleToggle(child.id, val)}
                      isPending={updateMutation.isPending && updateMutation.variables?.includes(child.id) !== isChildChecked}
                    />
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
