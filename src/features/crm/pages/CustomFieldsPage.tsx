import React, { useState } from 'react';
import { 
  Settings2, 
  Plus, 
  Trash2, 
  Loader2, 
  AlertCircle,
  Type,
  Hash,
  Calendar,
  List,
  CheckSquare,
  Link as LinkIcon
} from 'lucide-react';
import { useCustomFields, useRemoveField } from '@crm/hooks/useCustomFields';
import { CustomFieldFormSidebar } from '@crm/components/CustomFieldFormSidebar';
import { ConfirmModal } from '@shared/components/ConfirmModal';
import { EmptyState } from '@shared/components/EmptyState';
import { CustomField, CustomFieldType } from '@crm/types/crm';

const FIELD_TYPE_ICONS: Record<CustomFieldType, any> = {
  text: Type,
  number: Hash,
  date: Calendar,
  select: List,
  checkbox: CheckSquare,
  url: LinkIcon,
};

const FIELD_TYPE_LABELS: Record<CustomFieldType, string> = {
  text: 'Texto corto',
  number: 'Número',
  date: 'Fecha',
  select: 'Selección única',
  checkbox: 'Casilla de verificación',
  url: 'Enlace web',
};

export const CustomFieldsPage: React.FC = () => {
  const { data: fields, isLoading, isError, error } = useCustomFields();
  const removeMutation = useRemoveField();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingField, setEditingField] = useState<CustomField | null>(null);
  
  // Confirmation Modal State
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [fieldToDelete, setFieldToDelete] = useState<string | null>(null);

  const handleOpenSidebar = (field?: CustomField) => {
    setEditingField(field || null);
    setIsSidebarOpen(true);
  };

  const handleDeleteRequest = (id: string) => {
    setFieldToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (fieldToDelete) {
      await removeMutation.mutateAsync(fieldToDelete);
      setFieldToDelete(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-1">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Campos Personalizados</h2>
          <p className="text-sm text-slate-400">Personaliza la información que guardas de tus contactos.</p>
        </div>

        <button 
          onClick={() => handleOpenSidebar()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20"
        >
          <Plus size={18} />
          <span>Nuevo Campo</span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin text-indigo-400" size={32} />
          <p className="text-slate-400 text-sm">Cargando campos...</p>
        </div>
      ) : isError ? (
        <div className="flex items-center gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
          <AlertCircle size={18} />
          <span>Error: {(error as Error)?.message}</span>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {fields && fields.length > 0 ? (
            <div className="overflow-hidden rounded-2xl border border-white/[0.05] bg-slate-900/40 backdrop-blur-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.05] bg-white/[0.02]">
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Campo</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Tipo</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">ID Técnico</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Requerido</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  {fields.map((field) => {
                    const Icon = FIELD_TYPE_ICONS[field.type] || Type;
                    return (
                      <tr key={field.id} className="group hover:bg-white/[0.01] transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-slate-800 flex items-center justify-center text-indigo-400">
                              <Icon size={16} />
                            </div>
                            <span className="font-medium text-slate-200">{field.label}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-400">
                          {FIELD_TYPE_LABELS[field.type]}
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-slate-500">
                          {field.name}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex h-2 w-2 rounded-full ${field.required ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]' : 'bg-slate-700'}`} />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleOpenSidebar(field)}
                              className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                            >
                              <Settings2 size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteRequest(field.id)}
                              className="p-2 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState 
              icon={Settings2}
              title="No hay campos personalizados"
              description="Aún no has creado campos personalizados para extender la información de tus contactos."
              actionLabel="Crear mi primer campo"
              onAction={() => handleOpenSidebar()}
            />
          )}
        </div>
      )}

      {/* Sidebar for Create/Edit */}
      <CustomFieldFormSidebar 
        open={isSidebarOpen}
        field={editingField}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Confirmation Modal */}
      <ConfirmModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Eliminar Campo Personalizado"
        description="¿Estás seguro de eliminar este campo? Esta acción ocultará el campo de todos tus contactos. Recuerda que la eliminación es lógica y los datos históricos se mantienen en la base de datos."
        confirmText="Eliminar"
        variant="danger"
      />
    </div>
  );
};
