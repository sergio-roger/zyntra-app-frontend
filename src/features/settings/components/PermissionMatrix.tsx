import React from 'react';
import { PermissionToggle } from '@features/settings/components/PermissionToggle';
import { usePermissionMatrix } from '@features/settings/hooks/usePermissionMatrix';
import { Loader2 } from 'lucide-react';

interface PermissionMatrixProps {
  roleKey: 'manager' | 'agent';
  readOnly?: boolean;
}

export const PermissionMatrix: React.FC<PermissionMatrixProps> = ({ roleKey, readOnly = false }) => {
  const {
    isLoading,
    allMenus,
    rolePerms,
    roots,
    activeMenuIds,
    handleToggle,
    isUpdating,
    updatingVariables,
  } = usePermissionMatrix({ roleKey, readOnly });

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
                description={root.description || undefined}
                checked={isRootChecked}
                disabled={readOnly}
                onChange={(val) => handleToggle(root.id, val)}
                isPending={isUpdating && updatingVariables?.includes(root.id) !== isRootChecked}
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
                      description={child.description || undefined}
                      checked={isChildChecked}
                      disabled={readOnly}
                      onChange={(val) => handleToggle(child.id, val)}
                      isPending={isUpdating && updatingVariables?.includes(child.id) !== isChildChecked}
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
