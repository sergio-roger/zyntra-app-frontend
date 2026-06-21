import React from 'react';
import { usePlanModule } from '@features/auth/hooks/usePlanModule';
import { LockedModuleOverlay } from './LockedModuleOverlay';

interface ModuleGuardProps {
  menuKey: string;
  children: React.ReactNode;
  /** Custom fallback when locked. Defaults to LockedModuleOverlay. */
  fallback?: React.ReactNode;
}

export const ModuleGuard: React.FC<ModuleGuardProps> = ({ menuKey, children, fallback }) => {
  const { isLocked, isReadOnly } = usePlanModule(menuKey);

  if (isLocked) {
    return <>{fallback ?? <LockedModuleOverlay menuKey={menuKey} />}</>;
  }

  if (isReadOnly) {
    return (
      <div className="relative">
        <div className="pointer-events-none select-none opacity-70">
          {children}
        </div>
        <div className="sticky bottom-0 left-0 right-0 z-10 flex items-center justify-center gap-2 bg-warning/90 py-2 text-xs font-semibold text-warning-content backdrop-blur-sm">
          <span>Solo lectura — actualiza tu plan para editar</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
