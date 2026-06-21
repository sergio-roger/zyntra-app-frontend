import { Pencil, Trash2, User } from 'lucide-react';
import { Contact } from '@crm/types';
import { StageBadge, SourceBadge } from './badges';
import { EmptyState } from '@shared/components/EmptyState';

interface ContactTableProps {
  contacts: Contact[];
  onEdit: (c: Contact) => void;
  onDelete: (c: Contact) => void;
  onSelect: (c: Contact) => void;
  onAction?: () => void;
}

const formatDate = (iso: string | null) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString();
};

export const ContactTable: React.FC<ContactTableProps> = ({
  contacts,
  onEdit,
  onDelete,
  onSelect,
  onAction,
}) => {
  if (contacts.length === 0) {
    return (
      <EmptyState 
        icon={User}
        title="No se encontraron contactos"
        description="No hay registros que coincidan con los filtros seleccionados o tu base de datos está vacía."
        actionLabel={onAction ? "Crear contacto" : undefined}
        onAction={onAction}
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-white/10 bg-slate-900/50">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-white/10 bg-slate-900/80 text-xs text-slate-400 uppercase">
          <tr>
            <th className="px-4 py-3">Nombre</th>
            <th className="hidden md:table-cell px-4 py-3">Email</th>
            <th className="hidden sm:table-cell px-4 py-3">Teléfono</th>
            <th className="px-4 py-3">Etapa</th>
            <th className="hidden sm:table-cell px-4 py-3">Ciclo de vida</th>
            <th className="hidden md:table-cell px-4 py-3">Origen</th>
            <th className="hidden sm:table-cell px-4 py-3">Etiquetas</th>
            <th className="hidden md:table-cell px-4 py-3">Último contacto</th>
            <th className="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((c) => (
            <tr
              key={c.id}
              className="border-b border-white/5 transition-colors last:border-0 hover:bg-white/5"
            >
              <td className="px-4 py-3">
                <button
                  onClick={() => onSelect(c)}
                  className="text-left font-medium text-slate-100 hover:text-indigo-400"
                >
                  {c.name}
                </button>
              </td>
              <td className="hidden md:table-cell px-4 py-3 text-slate-300">{c.email ?? '—'}</td>
              <td className="hidden sm:table-cell px-4 py-3 text-slate-300">{c.phone ?? '—'}</td>
              <td className="px-4 py-3">
                <StageBadge stage={c.stage} />
              </td>
              <td className="hidden sm:table-cell px-4 py-3">
                {c.lifecycle_stage ? (
                  <span
                    className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium"
                    style={{
                      backgroundColor: `${c.lifecycle_stage.color}20`,
                      color: c.lifecycle_stage.color,
                      border: `1px solid ${c.lifecycle_stage.color}40`,
                    }}
                  >
                    {c.lifecycle_stage.name}
                  </span>
                ) : (
                  <span className="text-slate-600">—</span>
                )}
              </td>
              <td className="hidden md:table-cell px-4 py-3">
                <SourceBadge source={c.source} />
              </td>
              <td className="hidden sm:table-cell px-4 py-3">
                <div className="flex flex-wrap gap-1 max-w-[150px]">
                  {c.tags && c.tags.length > 0 ? (
                    c.tags.map((tag: any) => (
                      <span
                        key={tag.id}
                        className="text-[10px] px-2 py-0.5 rounded-full text-white font-medium"
                        style={{ backgroundColor: tag.color }}
                      >
                        {tag.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-600 text-xs">—</span>
                  )}
                </div>
              </td>
              <td className="hidden md:table-cell px-4 py-3 text-slate-400">
                {formatDate(c.last_activity_at)}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="inline-flex gap-1">
                  <button
                    onClick={() => onEdit(c)}
                    aria-label="Editar"
                    className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-white/10 hover:text-indigo-400"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => onDelete(c)}
                    aria-label="Eliminar"
                    className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-rose-500/15 hover:text-rose-400"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
