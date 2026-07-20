import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Loader2, Plus, Trash2 } from 'lucide-react';
import { ConfirmModal } from '@shared/components/ConfirmModal';
import { EmptyState } from '@shared/components/EmptyState';
import { useDeleteFormTemplate, useFormTemplatesList } from '../hooks/use-forms';
import { FormStatus, FormTemplate } from '../types/forms';

const formatDate = (iso: string) => new Date(iso).toLocaleDateString('es-EC');

const STATUS_LABELS: Record<FormStatus, string> = {
  [FormStatus.DRAFT]: 'Borrador',
  [FormStatus.PUBLISHED]: 'Publicado',
  [FormStatus.ARCHIVED]: 'Archivado',
};

const STATUS_CLASSES: Record<FormStatus, string> = {
  [FormStatus.DRAFT]: 'bg-slate-800 text-slate-400',
  [FormStatus.PUBLISHED]: 'bg-emerald-500/10 text-emerald-400',
  [FormStatus.ARCHIVED]: 'bg-slate-800/60 text-slate-600',
};

const StatusBadge: React.FC<{ status: FormStatus }> = ({ status }) => (
  <span
    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${STATUS_CLASSES[status]}`}
  >
    {STATUS_LABELS[status]}
  </span>
);

export const FormsListPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: templates = [], isLoading } = useFormTemplatesList();
  const deleteTemplate = useDeleteFormTemplate();

  const [templateToDelete, setTemplateToDelete] = useState<FormTemplate | null>(
    null,
  );

  const handleConfirmDelete = async () => {
    if (templateToDelete) {
      await deleteTemplate.mutateAsync(templateToDelete.id);
      setTemplateToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex w-full items-center justify-center py-24">
        <Loader2 size={24} className="animate-spin text-slate-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white tracking-tight">
            Formularios
          </h2>
          <p className="text-sm text-slate-400">
            Creá plantillas de formulario reutilizables para el widget de chat,
            agentes de IA o landings de Funnels.
          </p>
        </div>
        <button
          onClick={() => navigate('/automations/forms/new')}
          className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold shadow-lg bg-primary text-white shadow-primary/20 hover:-translate-y-px hover:shadow-xl active:scale-95 transition-all"
        >
          <Plus size={18} /> Crear formulario
        </button>
      </div>

      {templates.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Todavía no tenés formularios"
          description="Creá tu primera plantilla para empezar a capturar leads."
          actionLabel="Crear formulario"
          onAction={() => navigate('/automations/forms/new')}
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/10 bg-slate-900/50">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="border-b border-white/10 bg-slate-900/80 text-xs text-slate-400 uppercase">
              <tr>
                <th className="px-4 py-3 font-semibold">Nombre</th>
                <th className="px-4 py-3 font-semibold">Slug</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3 font-semibold">Creado</th>
                <th className="px-4 py-3 font-semibold" />
              </tr>
            </thead>
            <tbody>
              {templates.map((template) => (
                <tr
                  key={template.id}
                  className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] cursor-pointer transition-colors"
                  onClick={() => navigate(`/automations/forms/${template.id}`)}
                >
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-2 font-medium text-slate-100">
                      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                        <FileText size={13} />
                      </span>
                      {template.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-400">
                    {template.slug}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={template.status} />
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    {formatDate(template.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setTemplateToDelete(template);
                      }}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
                      aria-label={`Eliminar ${template.name}`}
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        isOpen={templateToDelete !== null}
        onClose={() => setTemplateToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Eliminar formulario"
        description={`¿Estás seguro de eliminar el formulario "${templateToDelete?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        variant="danger"
      />
    </div>
  );
};

export default FormsListPage;
