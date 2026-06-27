import { Pencil, Settings2, Trash2, User } from 'lucide-react';
import { Contact } from '@crm/types/contact';
import { SourceBadge } from './badges';
import { EmptyState } from '@shared/components/EmptyState';

interface ContactTableProps {
  contacts: Contact[];
  onEdit: (c: Contact) => void;
  onDelete: (c: Contact) => void;
  onSelect: (c: Contact) => void;
  onCustomFields?: (c: Contact) => void;
  onAction?: () => void;
  canEdit?: boolean;
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
  onCustomFields,
  onAction,
  canEdit = true,
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
            <th className="hidden sm:table-cell px-4 py-3">Ciclo de vida</th>
            <th className="hidden md:table-cell px-4 py-3">Origen</th>
            <th className="hidden sm:table-cell px-4 py-3">Propietario</th>
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
              <td className="hidden sm:table-cell px-4 py-3">
                {c.lifecycleStage ? (
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium"
                    style={{
                      backgroundColor: `${c.lifecycleStage.color}20`,
                      color: c.lifecycleStage.color,
                      border: `1px solid ${c.lifecycleStage.color}40`,
                    }}
                  >
                    {c.lifecycleStage.icon && (
                      <span className="text-[11px] leading-none">{c.lifecycleStage.icon}</span>
                    )}
                    {c.lifecycleStage.name}
                  </span>
                ) : (
                  <span className="text-slate-600">—</span>
                )}
              </td>
              <td className="hidden md:table-cell px-4 py-3">
                <SourceBadge source={c.source} />
              </td>
              <td className="hidden sm:table-cell px-4 py-3 text-slate-300">
                {c.owner ? c.owner.name : <span className="text-slate-600">—</span>}
              </td>
              <td className="hidden md:table-cell px-4 py-3 text-slate-400">
                {formatDate(c.lastActivityAt)}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="inline-flex gap-1">
                  {onCustomFields && (
                    <button
                      onClick={() => onCustomFields(c)}
                      aria-label="Campos personalizados"
                      className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-white/10 hover:text-violet-400"
                    >
                      <Settings2 size={15} />
                    </button>
                  )}
                  <button
                    onClick={() => onEdit(c)}
                    disabled={!canEdit}
                    aria-label="Editar"
                    className={`rounded-md p-1.5 transition-colors ${canEdit ? 'text-slate-400 hover:bg-white/10 hover:text-indigo-400' : 'cursor-not-allowed text-slate-700 opacity-40'}`}
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => onDelete(c)}
                    disabled={!canEdit}
                    aria-label="Eliminar"
                    className={`rounded-md p-1.5 transition-colors ${canEdit ? 'text-slate-400 hover:bg-rose-500/15 hover:text-rose-400' : 'cursor-not-allowed text-slate-700 opacity-40'}`}
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
