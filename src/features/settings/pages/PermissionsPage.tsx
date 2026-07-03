import { useAuthStore } from "@features/auth/store/authStore";
import { RoleCard } from "@features/settings/components/RoleCard";
import { RoleFormSidebar } from "@features/settings/components/RoleFormSidebar";
import {
  useCreateRole,
  useDeleteRole,
  useMenusList,
  useRolesList,
  useUpdateRole,
} from "@features/settings/hooks/usePermissions";
import { Loader2, Plus } from "lucide-react";
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

      <RoleFormSidebar
        open={isModalOpen}
        editingRole={editingRole}
        roleName={roleName}
        roleLabel={roleLabel}
        roleDesc={roleDesc}
        roleBadge={roleBadge}
        roleIconColor={roleIconColor}
        createError={createError}
        isMutationPending={isMutationPending}
        onRoleNameChange={setRoleName}
        onRoleLabelChange={setRoleLabel}
        onRoleDescChange={setRoleDesc}
        onRoleBadgeChange={setRoleBadge}
        onRoleIconColorChange={setRoleIconColor}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        onSubmit={handleCreateOrUpdateRole}
      />
    </div>
  );
};
