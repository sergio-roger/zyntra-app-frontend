import React, { useState, useEffect } from 'react';
import { PermissionToggle } from '@features/settings/components/PermissionToggle';
import { usePermissionMatrix } from '@features/settings/hooks/usePermissionMatrix';
import { Loader2, ChevronRight } from 'lucide-react';

interface PermissionMatrixProps {
  roleKey: string;
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

  const [activeTabKey, setActiveTabKey] = useState<string>('');

  // Set default active tab once roots load
  useEffect(() => {
    if (roots && roots.length > 0 && !activeTabKey) {
      setActiveTabKey(roots[0].key);
    }
  }, [roots, activeTabKey]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-400">
        <Loader2 className="animate-spin text-indigo-500" size={32} />
        <span>Cargando matriz de permisos...</span>
      </div>
    );
  }

  if (!allMenus || !rolePerms || roots.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        Error al cargar la información de permisos.
      </div>
    );
  }

  const activeRoot = roots.find((r) => r.key === activeTabKey) || roots[0];
  const children = allMenus.filter((m) => m.parent_key === activeRoot.key);
  const isRootChecked = activeMenuIds.includes(activeRoot.id);

  // Contar cuántos hijos activos tiene cada raíz para mostrar un indicador
  const getActiveChildrenCount = (rootKey: string) => {
    const rootChildren = allMenus.filter((m) => m.parent_key === rootKey);
    const activeChildren = rootChildren.filter((c) => activeMenuIds.includes(c.id));
    return `${activeChildren.length}/${rootChildren.length}`;
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 items-start">
      {/* Selector de pestañas vertical (Módulos principales) */}
      <div className="w-full md:w-72 bg-slate-900/40 border border-white/5 rounded-xl p-4 flex flex-col gap-1.5 self-stretch">
        <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 px-3 mb-2">Módulos</p>
        
        {roots.map((root) => {
          const isActive = root.key === activeTabKey;
          const isModuleActive = activeMenuIds.includes(root.id);
          const childCount = getActiveChildrenCount(root.key);

          return (
            <button
              key={root.id}
              onClick={() => setActiveTabKey(root.key)}
              className={`w-full text-left px-4 py-3.5 rounded-xl text-sm font-bold transition-all flex items-center justify-between group ${
                isActive
                  ? 'bg-primary text-primary-content shadow-lg shadow-primary/20 scale-[1.01]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`h-2.5 w-2.5 rounded-full transition-all ${
                  isModuleActive 
                    ? isActive ? 'bg-white' : 'bg-emerald-400' 
                    : 'bg-slate-700'
                }`} />
                <span>{root.label}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                  isActive ? 'bg-white/20 text-white' : 'bg-white/5 text-slate-500'
                }`}>
                  {childCount}
                </span>
                <ChevronRight size={14} className={`transition-transform duration-300 ${
                  isActive ? 'translate-x-0.5 opacity-100' : 'opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5'
                }`} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Contenedor de configuración de permisos a la derecha */}
      <div className="flex-1 w-full bg-slate-900/20 border border-white/5 rounded-xl p-6 md:p-8 min-h-[400px]">
        {/* Parent Module Toggle */}
        <div className="bg-slate-900 border border-white/5 rounded-xl p-6 shadow-xl mb-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-primary mb-1 block">Acceso Principal</span>
              <PermissionToggle
                menuId={activeRoot.id}
                label={activeRoot.label}
                description={activeRoot.description || undefined}
                checked={isRootChecked}
                disabled={readOnly}
                onChange={(val) => handleToggle(activeRoot.id, val)}
                isPending={isUpdating && updatingVariables?.includes(activeRoot.id) !== isRootChecked}
              />
            </div>
          </div>
        </div>

        {/* Children Grid */}
        {children.length > 0 ? (
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 pl-2">Subsecciones y Características</h4>
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4 ${!isRootChecked ? 'opacity-40 pointer-events-none transition-opacity duration-300' : ''}`}>
              {children.map((child) => {
                const isChildChecked = activeMenuIds.includes(child.id);

                return (
                  <div key={child.id} className="bg-slate-900/40 border border-white/5 hover:border-white/10 rounded-xl p-5 transition-all">
                    <PermissionToggle
                      menuId={child.id}
                      label={child.label}
                      description={child.description || undefined}
                      checked={isChildChecked}
                      disabled={readOnly}
                      onChange={(val) => handleToggle(child.id, val)}
                      isPending={isUpdating && updatingVariables?.includes(child.id) !== isChildChecked}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 border border-dashed border-white/5 rounded-xl">
            <p className="text-sm font-medium">Este módulo no contiene subsecciones configurables.</p>
            <p className="text-xs mt-1">El acceso es binario y se controla mediante el switch principal superior.</p>
          </div>
        )}
      </div>
    </div>
  );
};
