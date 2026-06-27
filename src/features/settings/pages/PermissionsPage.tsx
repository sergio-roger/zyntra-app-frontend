import { useAuthStore } from "@features/auth/store/authStore";
import { RoleCard } from "@features/settings/components/RoleCard";
import {
  useCreateRole,
  useDeleteRole,
  useMenusList,
  useRolesList,
  useUpdateRole,
} from "@features/settings/hooks/usePermissions";
import { Loader2, Plus, Shield } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const PermissionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const { data: allMenus = [], isLoading: loadingMenus } = useMenusList();
  const { data: dbRoles = [], isLoading: loadingRoles } = useRolesList();
  const createRoleMutation = useCreateRole();
  const updateRoleMutation = useUpdateRole();
  const deleteRoleMutation = useDeleteRole();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<any | null>(null);
  const [roleName, setRoleName] = useState("");
  const [roleLabel, setRoleLabel] = useState("");
  const [roleDesc, setRoleDesc] = useState("");
  const [roleBadge, setRoleBadge] = useState("");
  const [roleIconColor, setRoleIconColor] = useState(
    "text-primary bg-primary/10 border-primary/20",
  );
  const [createError, setCreateError] = useState("");

  const totalMenus = allMenus.length;
  const isLoading = loadingMenus || loadingRoles;

  const resetForm = () => {
    setEditingRole(null);
    setRoleName("");
    setRoleLabel("");
    setRoleDesc("");
    setRoleBadge("");
    setRoleIconColor("text-primary bg-primary/10 border-primary/20");
    setCreateError("");
  };

  const handleCreateOrUpdateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError("");

    const sanitizedName = roleName.trim().toLowerCase().replace(/\s+/g, "_");
    if (!editingRole && !/^[a-z0-9_]+$/.test(sanitizedName)) {
      setCreateError(
        "El identificador del rol solo puede contener letras minúsculas, números y guiones bajos.",
      );
      return;
    }

    try {
      if (editingRole) {
        // Modo Edición
        await updateRoleMutation.mutateAsync({
          roleName: editingRole.name,
          data: {
            label: roleLabel.trim(),
            description: roleDesc.trim(),
            badge: roleBadge.trim() || undefined,
            iconColor: roleIconColor,
            badgeColor: roleIconColor
              .replace("bg-", "bg-")
              .replace("text-", "text-"),
          },
        });
      } else {
        // Modo Creación
        await createRoleMutation.mutateAsync({
          name: sanitizedName,
          label: roleLabel.trim(),
          description: roleDesc.trim(),
          badge: roleBadge.trim() || undefined,
          iconColor: roleIconColor,
          badgeColor: roleIconColor
            .replace("bg-", "bg-")
            .replace("text-", "text-"),
        });
      }
      setIsModalOpen(false);
      resetForm();
    } catch (err: any) {
      setCreateError(
        err?.response?.data?.message ||
          "Error al guardar el rol. Inténtalo de nuevo.",
      );
    }
  };

  const handleEditClick = (role: any) => {
    setEditingRole(role);
    setRoleName(role.name);
    setRoleLabel(role.label);
    setRoleDesc(role.description);
    setRoleBadge(role.badge || "");
    setRoleIconColor(
      role.iconColor || "text-primary bg-primary/10 border-primary/20",
    );
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (role: any) => {
    if (
      window.confirm(
        `¿Estás seguro de que deseas eliminar el rol "${role.label}"? Se revocarán todos los permisos asociados.`,
      )
    ) {
      try {
        await deleteRoleMutation.mutateAsync(role.name);
      } catch (err: any) {
        alert(err?.response?.data?.message || "Error al eliminar el rol.");
      }
    }
  };

  const isMutationPending =
    createRoleMutation.isPending || updateRoleMutation.isPending;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Permisos de Acceso
          </h2>
          <p className="text-sm text-slate-400">
            Define qué secciones y funcionalidades puede ver cada rol en la
            plataforma.
          </p>
        </div>

        {/* Botón de crear rol si cuenta con el plan con permisos (Core Digital) */}
        {user?.plan?.name === "Core Digital" && (
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-primary-content font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Plus size={16} />
            Crear nuevo rol
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="animate-spin text-primary" size={40} />
          <p className="text-sm text-slate-500 font-medium">
            Cargando información de roles y permisos...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {dbRoles.map((role) => (
            <RoleCard
              key={role.id}
              role={role}
              totalMenus={totalMenus}
              user={user}
              navigate={navigate}
              onEdit={() => handleEditClick(role)}
              onDelete={() => handleDeleteClick(role)}
            />
          ))}
        </div>
      )}

      {/* Modal para Crear/Editar Rol */}
      {isModalOpen && (
        <div className="modal modal-open z-[250]">
          <div className="modal-box bg-slate-950 border border-white/10 rounded-xl p-6 text-white max-w-md shadow-2xl">
            <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
              <Shield className="text-primary animate-pulse" />{" "}
              {editingRole ? "Editar Rol" : "Crear Nuevo Rol"}
            </h3>

            <form onSubmit={handleCreateOrUpdateRole} className="space-y-4">
              <div>
                <label className="label text-xs font-bold uppercase tracking-wider text-slate-400">
                  Identificador del Rol (Único en minúsculas)
                </label>
                <input
                  type="text"
                  placeholder="ej. manager_ventas"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  className="input input-bordered w-full bg-slate-900 border-white/10 focus:border-primary text-sm rounded-xl mt-1 text-white disabled:opacity-50"
                  required
                  disabled={!!editingRole}
                />
              </div>

              <div>
                <label className="label text-xs font-bold uppercase tracking-wider text-slate-400">
                  Nombre Visible (Label)
                </label>
                <input
                  type="text"
                  placeholder="ej. Gerente de Ventas"
                  value={roleLabel}
                  onChange={(e) => setRoleLabel(e.target.value)}
                  className="input input-bordered w-full bg-slate-900 border-white/10 focus:border-primary text-sm rounded-xl mt-1 text-white"
                  required
                />
              </div>

              <div>
                <label className="label text-xs font-bold uppercase tracking-wider text-slate-400">
                  Descripción
                </label>
                <textarea
                  placeholder="Describe las responsabilidades de este rol..."
                  value={roleDesc}
                  onChange={(e) => setRoleDesc(e.target.value)}
                  className="textarea textarea-bordered w-full bg-slate-900 border-white/10 focus:border-primary text-sm rounded-xl h-20 mt-1 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label text-xs font-bold uppercase tracking-wider text-slate-400">
                    Badge (Etiqueta)
                  </label>
                  <input
                    type="text"
                    placeholder="ej. Ventas"
                    value={roleBadge}
                    onChange={(e) => setRoleBadge(e.target.value)}
                    className="input input-bordered w-full bg-slate-900 border-white/10 focus:border-primary text-sm rounded-xl mt-1 text-white"
                  />
                </div>
                <div>
                  <label className="label text-xs font-bold uppercase tracking-wider text-slate-400">
                    Color del Rol / Icono
                  </label>
                  <select
                    value={roleIconColor}
                    onChange={(e) => setRoleIconColor(e.target.value)}
                    className="select select-bordered w-full bg-slate-900 border-white/10 text-sm rounded-xl mt-1 text-white"
                  >
                    <option value="text-primary bg-primary/10 border-primary/20">
                      Violeta
                    </option>
                    <option value="text-emerald-400 bg-emerald-500/10 border-emerald-500/20">
                      Esmeralda
                    </option>
                    <option value="text-blue-400 bg-blue-500/10 border-blue-500/20">
                      Azul
                    </option>
                    <option value="text-amber-400 bg-amber-500/10 border-amber-500/20">
                      Ambar
                    </option>
                    <option value="text-rose-400 bg-rose-500/10 border-rose-500/20">
                      Rosa
                    </option>
                  </select>
                </div>
              </div>

              {createError && (
                <p className="text-xs text-error font-medium bg-error/10 p-2.5 rounded-xl border border-error/20">
                  {createError}
                </p>
              )}

              <div className="modal-action mt-6 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="btn btn-ghost border-white/5 hover:bg-white/5 text-sm font-bold rounded-xl"
                  disabled={isMutationPending}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary text-white text-sm font-bold rounded-xl px-6"
                  disabled={isMutationPending}
                >
                  {isMutationPending ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    "Guardar Rol"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
