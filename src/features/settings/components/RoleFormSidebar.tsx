import { ROLE_COLOR_OPTIONS } from '@core/constants/colors';
import { Input } from '@core/ui/Input';
import { Textarea } from '@core/ui/Textarea';
import {
  AlignLeft,
  Check,
  Hash,
  Loader2,
  Palette,
  Shield,
  Tag,
  Type,
  X,
} from 'lucide-react';
import React from 'react';

interface RoleFormSidebarProps {
  open: boolean;
  editingRole: any | null;
  roleName: string;
  roleLabel: string;
  roleDesc: string;
  roleBadge: string;
  roleIconColor: string;
  createError: string;
  isMutationPending: boolean;
  onRoleNameChange: (v: string) => void;
  onRoleLabelChange: (v: string) => void;
  onRoleDescChange: (v: string) => void;
  onRoleBadgeChange: (v: string) => void;
  onRoleIconColorChange: (v: string) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const RoleFormSidebar: React.FC<RoleFormSidebarProps> = ({
  open,
  editingRole,
  roleName,
  roleLabel,
  roleDesc,
  roleBadge,
  roleIconColor,
  createError,
  isMutationPending,
  onRoleNameChange,
  onRoleLabelChange,
  onRoleDescChange,
  onRoleBadgeChange,
  onRoleIconColorChange,
  onClose,
  onSubmit,
}) => {
  const selectedColor =
    ROLE_COLOR_OPTIONS.find((o) => o.value === roleIconColor)?.color ??
    '#8b5cf6';

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 !mt-0 backdrop-blur-sm z-[60] transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed inset-y-0 right-0 w-full !mt-0 max-w-md bg-slate-900 border-l border-white/10 z-[70] shadow-2xl transform transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/5 bg-slate-900/50 backdrop-blur-md">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${selectedColor}20` }}
                >
                  <Shield size={18} style={{ color: selectedColor }} />
                </div>
                {editingRole ? 'Editar Rol' : 'Nuevo Rol'}
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                Define los permisos y la identidad visual del rol
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form
            id="role-form"
            onSubmit={onSubmit}
            className="flex-1 overflow-y-auto p-6 space-y-6"
          >
            <Input
              label="Identificador único"
              icon={Hash}
              required
              value={roleName}
              onChange={(e) => onRoleNameChange(e.target.value)}
              placeholder="ej. manager_ventas"
              disabled={!!editingRole}
            />

            <Input
              label="Nombre visible"
              icon={Type}
              required
              value={roleLabel}
              onChange={(e) => onRoleLabelChange(e.target.value)}
              placeholder="ej. Gerente de Ventas"
            />

            <Input
              label="Etiqueta (Badge)"
              icon={Tag}
              value={roleBadge}
              onChange={(e) => onRoleBadgeChange(e.target.value)}
              placeholder="ej. Ventas"
            />

            <Textarea
              label="Descripción"
              icon={AlignLeft}
              rows={3}
              required
              value={roleDesc}
              onChange={(e) => onRoleDescChange(e.target.value)}
              placeholder="Describe las responsabilidades de este rol..."
            />

            {/* Color swatches */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                <Palette size={14} className="text-slate-500" />
                Color del rol e ícono
              </label>
              <div className="flex flex-wrap gap-3">
                {ROLE_COLOR_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    title={opt.label}
                    onClick={() => onRoleIconColorChange(opt.value)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      roleIconColor === opt.value
                        ? 'border-white scale-110 shadow-lg'
                        : 'border-transparent opacity-50 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: opt.color }}
                  />
                ))}
              </div>
            </div>

            {createError && (
              <p className="text-xs text-rose-400 font-medium bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
                {createError}
              </p>
            )}
          </form>

          {/* Footer */}
          <div className="p-6 border-t border-white/5 bg-slate-900/50 backdrop-blur-md">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isMutationPending}
                className="flex-1 px-4 py-3 rounded-xl bg-slate-800 text-slate-300 text-sm font-bold hover:bg-slate-700 transition-all disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                form="role-form"
                type="submit"
                disabled={isMutationPending}
                className="flex-[2] px-4 py-3 rounded-xl text-white text-sm font-bold transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                style={{
                  backgroundColor: selectedColor,
                  boxShadow: `0 4px 14px ${selectedColor}40`,
                }}
              >
                {isMutationPending ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Check size={18} />
                )}
                {editingRole ? 'Guardar Cambios' : 'Crear Rol'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
