import { DEFAULT_COMPANY_COLUMNS } from '@crm/constants/company-columns';
import { Company } from '@crm/types/company';
import { EmptyState } from '@shared/components/EmptyState';
import { OwnerDisplay } from '@shared/components/OwnerDisplay';
import { ColumnConfig } from '@shared/types/column';
import {
  Building2,
  ExternalLink,
  Pencil,
  Settings2,
  Trash2,
} from 'lucide-react';
import React from 'react';

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
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('es-EC');
};

const getCustomFieldValue = (c: Company, colKey: string) => {
  const val = c.customFields?.[colKey];
  if (val === undefined || val === null || val === '')
    return <span className="text-base-content/40">—</span>;
  if (typeof val === 'boolean') {
    return (
      <span
        className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold ${
          val
            ? 'bg-success/10 text-success'
            : 'bg-base-300 text-base-content/60'
        }`}
      >
        {val ? 'Sí' : 'No'}
      </span>
    );
  }
  if (Array.isArray(val)) {
    return <span className="text-base-content/70">{val.join(', ')}</span>;
  }
  return <span className="text-base-content/70">{String(val)}</span>;
};

const RENDERERS: Record<
  string,
  (c: Company, onSelect?: (c: Company) => void) => React.ReactNode
> = {
  name: (c, onSelect) => (
    <button
      onClick={() => onSelect?.(c)}
      className="flex items-center gap-2 text-left font-medium text-base-content hover:text-primary"
    >
      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Building2 size={13} />
      </span>
      {c.name}
    </button>
  ),
  taxType: (c) => <span className="text-base-content/70">{c.taxType ?? '—'}</span>,
  identification: (c) => (
    <span className="text-base-content/70">{c.identification ?? '—'}</span>
  ),
  website: (c) =>
    c.website ? (
      <a
        href={c.website.startsWith('http') ? c.website : `https://${c.website}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-link hover:underline"
        onClick={(e) => e.stopPropagation()}
      >
        <ExternalLink size={11} />
        <span className="max-w-[140px] truncate text-xs">
          {c.website.replace(/^https?:\/\//, '')}
        </span>
      </a>
    ) : (
      <span className="text-base-content/40">—</span>
    ),
  employeeRange: (c) => (
    <span className="text-base-content/70">
      {c.employeeRange ? (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-base-300 bg-base-300/50 px-2.5 py-0.5 text-xs">
          {c.employeeRange}
        </span>
      ) : (
        <span className="text-base-content/40">—</span>
      )}
    </span>
  ),
  owner: (c) => <OwnerDisplay owner={c.owner} />,
  industry: (c) =>
    c.industry ? (
      <span className="inline-flex items-center rounded-md border border-base-300 bg-base-300 px-2 py-0.5 text-[10px] font-medium text-base-content/70">
        {c.industry.name}
      </span>
    ) : (
      <span className="text-base-content/40">—</span>
    ),
  lifecycleStage: (c) =>
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
          <span className="text-[11px] leading-none">
            {c.lifecycle_stage.icon}
          </span>
        )}
        {c.lifecycle_stage.name}
      </span>
    ) : (
      <span className="text-base-content/40">—</span>
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
        <span className="text-[9px] text-base-content/50">+{c.tags.length - 3}</span>
      )}
      {(c.tags ?? []).length === 0 && <span className="text-base-content/40">—</span>}
    </div>
  ),
  createdAt: (c) => (
    <span className="text-base-content/60">{formatDate(c.createdAt)}</span>
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
        actionLabel={onAction ? 'Crear empresa' : undefined}
        onAction={onAction}
      />
    );
  }

  const visibleCols = columns.filter((col) => col.visible);

  return (
    <div className="overflow-x-auto rounded-xl border border-base-300 bg-base-200 shadow-md">
      <table className="w-full text-left text-sm border-collapse">
        <thead className="border-b border-base-300 bg-base-300/30 text-xs text-base-content/60 uppercase">
          <tr>
            {visibleCols.map((col) => (
              <th key={col.key} className="px-4 py-3 font-semibold">
                {col.label.replace(' (Campo Personalizado)', '')}
              </th>
            ))}
            <th className="px-4 py-3 text-right font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((c) => (
            <tr
              key={c.id}
              className="border-b border-base-300/50 transition-colors last:border-0 hover:bg-base-300/20"
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
                      className="rounded-md p-1.5 text-base-content/50 transition-colors hover:bg-base-300/50 hover:text-primary"
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
                        ? 'text-base-content/50 hover:bg-base-300/50 hover:text-primary'
                        : 'cursor-not-allowed text-base-content/20 opacity-40'
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
                        ? 'text-base-content/50 hover:bg-error/15 hover:text-error'
                        : 'cursor-not-allowed text-base-content/20 opacity-40'
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
