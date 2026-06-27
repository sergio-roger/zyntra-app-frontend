import { DEFAULT_COMPANY_COLUMNS } from "@crm/constants/company-columns";
import { Company } from "@crm/types/company";
import { EmptyState } from "@shared/components/EmptyState";
import { ColumnConfig } from "@shared/types/column";
import { Building2, ExternalLink, Pencil, Settings2, Trash2 } from "lucide-react";
import React from "react";

interface CompanyTableProps {
  companies: Company[];
  columns?: ColumnConfig[];
  onEdit: (c: Company) => void;
  onDelete: (c: Company) => void;
  onSelect: (c: Company) => void;
  onCustomFields?: (c: Company) => void;
  onAction?: () => void;
  canEdit?: boolean;
}

const formatDate = (iso: string | null | undefined) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("es-EC");
};

const getCustomFieldValue = (c: Company, colKey: string) => {
  const val = c.custom_fields?.[colKey];
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
  (c: Company, onSelect?: (c: Company) => void) => React.ReactNode
> = {
  name: (c, onSelect) => (
    <button
      onClick={() => onSelect?.(c)}
      className="flex items-center gap-2 text-left font-medium text-slate-100 hover:text-indigo-400"
    >
      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
        <Building2 size={13} />
      </span>
      {c.name}
    </button>
  ),
  identification: (c) => <span className="text-slate-300">{c.identification ?? "—"}</span>,
  website: (c) => (
    c.website ? (
      <a
        href={c.website.startsWith("http") ? c.website : `https://${c.website}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-indigo-400 hover:underline"
        onClick={(e) => e.stopPropagation()}
      >
        <ExternalLink size={11} />
        <span className="max-w-[140px] truncate text-xs">
          {c.website.replace(/^https?:\/\//, "")}
        </span>
      </a>
    ) : (
      <span className="text-slate-600">—</span>
    )
  ),
  sector: (c) => (
    c.sector_type ? (
      <span className="inline-flex items-center rounded-md border border-slate-700 bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-300">
        {c.sector_type.name}
      </span>
    ) : (
      <span className="text-slate-600">—</span>
    )
  ),
  lifecycleStage: (c) => (
    c.lifecycle_stage ? (
      <span
        className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-medium"
        style={{
          backgroundColor: `${c.lifecycle_stage.color}20`,
          color: c.lifecycle_stage.color,
          border: `1px solid ${c.lifecycle_stage.color}40`,
        }}
      >
        {c.lifecycle_stage.icon && (
          <span className="text-[11px] leading-none">{c.lifecycle_stage.icon}</span>
        )}
        {c.lifecycle_stage.name}
      </span>
    ) : (
      <span className="text-slate-600">—</span>
    )
  ),
  numEmployees: (c) => (
    <span className="text-slate-300">
      {c.num_employees !== null && c.num_employees !== undefined
        ? c.num_employees.toLocaleString("es-EC")
        : "—"}
    </span>
  ),
  tags: (c) => (
    <div className="flex flex-wrap gap-1">
      {(c.tags ?? []).slice(0, 3).map((tag) => (
        <span
          key={tag.id}
          className="inline-flex rounded-full px-2 py-0.5 text-[9px] font-bold text-white"
          style={{ backgroundColor: tag.color }}
        >
          {tag.name}
        </span>
      ))}
      {(c.tags ?? []).length > 3 && (
        <span className="text-[9px] text-slate-500">
          +{c.tags.length - 3}
        </span>
      )}
      {(c.tags ?? []).length === 0 && (
        <span className="text-slate-600">—</span>
      )}
    </div>
  ),
  createdAt: (c) => (
    <span className="text-slate-400">{formatDate(c.created_at)}</span>
  ),
};

export const CompanyTable: React.FC<CompanyTableProps> = ({
  companies,
  columns = DEFAULT_COMPANY_COLUMNS,
  onEdit,
  onDelete,
  onSelect,
  onCustomFields,
  onAction,
  canEdit = true,
}) => {
  if (companies.length === 0) {
    return (
      <EmptyState
        icon={Building2}
        title="No se encontraron empresas"
        description="No hay registros que coincidan con los filtros seleccionados o tu base de datos está vacía."
        actionLabel={onAction ? "Crear empresa" : undefined}
        onAction={onAction}
      />
    );
  }

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
          {companies.map((c) => (
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
                      className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-white/10 hover:text-indigo-400"
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
