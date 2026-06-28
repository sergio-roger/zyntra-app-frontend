import { DEFAULT_COLUMNS } from "@crm/constants/contact-columns";
import { Contact } from "@crm/types/contact";
import { EmptyState } from "@shared/components/EmptyState";
import { ColumnConfig } from "@shared/types/column";
import { Pencil, Settings2, Trash2, User } from "lucide-react";
import React from "react";
import { SourceBadge } from "./badges";

interface ContactTableProps {
  contacts: Contact[];
  columns?: ColumnConfig[];
  onEdit: (c: Contact) => void;
  onDelete: (c: Contact) => void;
  onSelect: (c: Contact) => void;
  onCustomFields?: (c: Contact) => void;
  onAction?: () => void;
  canEdit?: boolean;
}

const formatDate = (iso: string | null) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString();
};

const getCustomFieldValue = (c: Contact, colKey: string) => {
  const val = c.customFields?.[colKey];
  if (val === undefined || val === null || val === "") return <span className="text-slate-600">—</span>;
  if (typeof val === "boolean") {
    return (
      <span
        className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold ${
          val ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-800 text-slate-400"
        }`}
      >
        {val ? "Sí" : "No"}
      </span>
    );
  }
  if (Array.isArray(val)) {
    return <span className="text-slate-300">{val.join(", ")}</span>;
  }
  return <span className="text-slate-300">{String(val)}</span>;
};

const RENDERERS: Record<
  string,
  (c: Contact, onSelect?: (c: Contact) => void) => React.ReactNode
> = {
  name: (c, onSelect) => (
    <button
      onClick={() => onSelect?.(c)}
      className="text-left font-medium text-slate-100 hover:text-indigo-400"
    >
      {c.name}
    </button>
  ),
  email: (c) => <span className="text-slate-300">{c.email ?? "—"}</span>,
  phone: (c) => <span className="text-slate-300">{c.phone ?? "—"}</span>,
  lifecycleStage: (c) => {
    if (!c.lifecycleStage) return <span className="text-slate-600">—</span>;
    return (
      <span
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium"
        style={{
          backgroundColor: `${c.lifecycleStage.color}20`,
          color: c.lifecycleStage.color,
          border: `1px solid ${c.lifecycleStage.color}40`,
        }}
      >
        {c.lifecycleStage.icon && (
          <span className="text-[11px] leading-none">
            {c.lifecycleStage.icon}
          </span>
        )}
        {c.lifecycleStage.name}
      </span>
    );
  },
  source: (c) => <SourceBadge source={c.source} />,
  owner: (c) => (
    <span className="text-slate-300">
      {c.owner ? c.owner.name : <span className="text-slate-600">—</span>}
    </span>
  ),
  notes: (c) => (
    <span
      className="text-slate-400 text-xs block max-w-[220px] truncate"
      title={c.notes ?? ""}
    >
      {c.notes ?? <span className="text-slate-600">—</span>}
    </span>
  ),
  lastActivityAt: (c) => (
    <span className="text-slate-400">{formatDate(c.lastActivityAt)}</span>
  ),
};

export const ContactTable: React.FC<ContactTableProps> = ({
  contacts,
  columns = DEFAULT_COLUMNS,
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

  // Filter only visible columns configuration
  const visibleCols = columns.filter((col) => col.visible);

  return (
    <div className="overflow-x-auto rounded-xl border border-white/10 bg-slate-900/50">
      <table className="w-full text-left text-sm border-collapse">
        <thead className="border-b border-white/10 bg-slate-900/80 text-xs text-slate-400 uppercase">
          <tr>
            {visibleCols.map((col) => (
              <th key={col.key} className="px-4 py-3 font-semibold">
                {col.label.replace(" (Campo Personalizado)", "")}
              </th>
            ))}
            <th className="px-4 py-3 text-right font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((c) => (
            <tr
              key={c.id}
              className="border-b border-white/5 transition-colors last:border-0 hover:bg-white/5"
            >
              {visibleCols.map((col) => (
                <td key={col.key} className="px-4 py-3 align-middle">
                  {RENDERERS[col.key]
                    ? RENDERERS[col.key](c, onSelect)
                    : getCustomFieldValue(c, col.key)}
                </td>
              ))}
              <td className="px-4 py-3 text-right align-middle">
                <div className="inline-flex gap-1 justify-end">
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
                    className={`rounded-md p-1.5 transition-colors ${
                      canEdit
                        ? "text-slate-400 hover:bg-white/10 hover:text-indigo-400"
                        : "cursor-not-allowed text-slate-700 opacity-40"
                    }`}
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => onDelete(c)}
                    disabled={!canEdit}
                    aria-label="Eliminar"
                    className={`rounded-md p-1.5 transition-colors ${
                      canEdit
                        ? "text-slate-400 hover:bg-rose-500/15 hover:text-rose-400"
                        : "cursor-not-allowed text-slate-700 opacity-40"
                    }`}
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
