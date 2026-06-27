import { TagFormSidebar } from "@crm/components/TagFormSidebar";
import { useRemoveTag, useTags } from "@crm/hooks/useTags";
import { Tag } from "@crm/types/tag";
import { ConfirmModal } from "@shared/components/ConfirmModal";
import { EmptyState } from "@shared/components/EmptyState";
import {
  AlertCircle,
  Edit2,
  Loader2,
  Plus,
  Search,
  Tag as TagIcon,
  Trash2,
} from "lucide-react";
import React, { useState } from "react";

export const TagsPage: React.FC = () => {
  const { data: tags, isLoading, isError, error } = useTags();
  const removeMutation = useRemoveTag();

  const [search, setSearch] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [tagToDelete, setTagToDelete] = useState<string | null>(null);

  const filteredTags = tags?.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description?.toLowerCase().includes(search.toLowerCase()),
  );

  const handleOpenSidebar = (tag?: Tag) => {
    setEditingTag(tag || null);
    setIsSidebarOpen(true);
  };

  const handleDeleteRequest = (id: string) => {
    setTagToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (tagToDelete) {
      await removeMutation.mutateAsync(tagToDelete);
      setTagToDelete(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-1">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Etiquetas
          </h2>
          <p className="text-sm text-slate-400">
            Organiza y segmenta tus contactos eficazmente.
          </p>
        </div>

        <button
          onClick={() => handleOpenSidebar()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20"
        >
          <Plus size={18} />
          <span>Nueva Etiqueta</span>
        </button>
      </div>

      <div className="relative max-w-md">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          size={16}
        />
        <input
          type="text"
          placeholder="Buscar etiquetas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/50 border border-white/5 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
        />
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin text-indigo-400" size={32} />
          <p className="text-slate-400 text-sm">Cargando etiquetas...</p>
        </div>
      ) : isError ? (
        <div className="flex items-center gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
          <AlertCircle size={18} />
          <span>Error: {(error as Error)?.message}</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredTags?.map((tag) => (
            <div
              key={tag.id}
              className="group relative flex flex-col gap-3 rounded-2xl border border-white/[0.05] bg-slate-900/40 p-5 transition-all hover:bg-slate-900/60 hover:border-white/[0.1] shadow-xl shadow-black/10"
            >
              <div className="flex items-start justify-between">
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center text-white shadow-lg"
                  style={{ backgroundColor: tag.color }}
                >
                  <TagIcon size={20} />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleOpenSidebar(tag)}
                    className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteRequest(tag.id)}
                    className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-400"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-white text-lg">{tag.name}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 min-h-[32px]">
                  {tag.description || "Sin descripción"}
                </p>
              </div>

              <div className="mt-2 flex items-center justify-between border-t border-white/[0.05] pt-3">
                <span className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">
                  CRM Tag
                </span>
                <div className="flex -space-x-2">
                  <div className="h-6 w-6 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] text-slate-400 font-bold">
                    0
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredTags?.length === 0 && (
            <div className="col-span-full">
              <EmptyState
                icon={TagIcon}
                title="No hay etiquetas"
                description={
                  search
                    ? `No se encontraron etiquetas que coincidan con "${search}"`
                    : "Aún no has creado etiquetas para segmentar a tus contactos."
                }
                actionLabel={search ? undefined : "Crear mi primera etiqueta"}
                onAction={search ? undefined : () => handleOpenSidebar()}
              />
            </div>
          )}
        </div>
      )}

      {/* Sidebar for Create/Edit */}
      <TagFormSidebar
        open={isSidebarOpen}
        tag={editingTag}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Eliminar Etiqueta"
        description="¿Estás seguro de eliminar esta etiqueta? Los contactos que la tengan asignada dejarán de mostrarla, aunque no perderás a los contactos."
        confirmText="Eliminar"
        variant="danger"
      />
    </div>
  );
};
