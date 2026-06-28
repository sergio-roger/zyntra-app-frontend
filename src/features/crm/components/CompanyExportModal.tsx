import { ExportColumn } from '@core/types/api';
import { generateExportFilename } from '@core/utils/export';
import { companiesApi } from '@crm/api/companies.api';
import { STANDARD_COMPANY_EXPORT_COLUMNS as STANDARD_COLUMNS } from '@crm/constants/company-columns';
import { useCustomFields } from '@crm/hooks/useCustomFields';
import { ListCompaniesQuery } from '@crm/types/company';
import {
  ArrowDown,
  ArrowUp,
  Building2,
  Download,
  FileText,
  Loader2,
  Plus,
  X,
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';

interface CompanyExportModalProps {
  open: boolean;
  onClose: () => void;
  total: number;
  queryParams: Omit<ListCompaniesQuery, 'page' | 'limit'>;
}

export const CompanyExportModal: React.FC<CompanyExportModalProps> = ({
  open,
  onClose,
  total,
  queryParams,
}) => {
  const { data: customFieldDefs = [] } = useCustomFields('company');

  const customColumns = useMemo<ExportColumn[]>(
    () =>
      customFieldDefs
        .filter((f) => f.is_active)
        .map((f) => ({ key: `cf_${f.name}`, label: f.label })),
    [customFieldDefs],
  );

  const ALL_COLUMNS = useMemo(
    () => [...STANDARD_COLUMNS, ...customColumns],
    [customColumns],
  );

  const [activeColumns, setActiveColumns] =
    useState<ExportColumn[]>(STANDARD_COLUMNS);
  const [filename, setFilename] = useState(() => generateExportFilename('empresas'));
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (open) {
      setActiveColumns(STANDARD_COLUMNS);
      setFilename(generateExportFilename('empresas'));
    }
  }, [open]);

  const activeKeys = useMemo(
    () => new Set(activeColumns.map((c) => c.key)),
    [activeColumns],
  );

  const availableColumns = useMemo(
    () => ALL_COLUMNS.filter((c) => !activeKeys.has(c.key)),
    [ALL_COLUMNS, activeKeys],
  );

  const move = (index: number, dir: -1 | 1) => {
    const next = [...activeColumns];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setActiveColumns(next);
  };

  const handleDownload = async () => {
    if (isDownloading || activeColumns.length === 0) return;
    setIsDownloading(true);
    try {
      const filters: Record<string, unknown> = {};
      if (queryParams.search) filters.search = queryParams.search;
      if (queryParams.industryId) filters.industryId = queryParams.industryId;
      if (queryParams.lifecycleStageId) filters.lifecycleStageId = queryParams.lifecycleStageId;
      if (queryParams.createdAtFrom) filters.createdAtFrom = queryParams.createdAtFrom;
      if (queryParams.createdAtTo) filters.createdAtTo = queryParams.createdAtTo;

      const res = await companiesApi.exportCsv({ filters, columns: activeColumns });
      const blob =
        res instanceof Blob
          ? res
          : new Blob([res], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const safeName = (filename.trim()).replace(
        /[^a-zA-Z0-9_-]/g,
        '_',
      );
      a.download = `${safeName}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      onClose();
    } catch {
      // silent — user can retry
    } finally {
      setIsDownloading(false);
    }
  };

  const canDownload = activeColumns.length > 0 && total > 0 && !isDownloading;

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="relative flex h-[600px] max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl border border-white/10 bg-slate-900 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
            <div>
              <h2 className="text-base font-bold text-white">
                Exportar empresas
              </h2>
              <p className="mt-0.5 text-xs text-slate-400">
                Configura las columnas que se incluirán en el archivo CSV
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="flex min-h-0 flex-1 overflow-hidden">
            {/* Left */}
            <div className="flex w-[52%] flex-col gap-5 overflow-y-auto border-r border-white/10 px-5 py-5">
              <div className="flex items-start gap-3 rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-4 py-3">
                <Building2 size={15} className="mt-0.5 shrink-0 text-indigo-400" />
                <p className="text-sm leading-snug text-indigo-300">
                  Se exportarán{' '}
                  <span className="font-bold">
                    {total.toLocaleString('es-EC')} empresa
                    {total !== 1 ? 's' : ''}
                  </span>{' '}
                  con los filtros actuales
                </p>
              </div>

              <hr className="border-white/10" />

              {/* Filename */}
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Nombre del archivo
                </label>
                <div className="flex items-center gap-2 rounded-lg border border-slate-700/60 bg-slate-800/60 px-3 py-2 transition-all focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/20">
                  <FileText size={13} className="shrink-0 text-slate-500" />
                  <input
                    type="text"
                    value={filename}
                    onChange={(e) => setFilename(e.target.value)}
                    className="min-w-0 flex-1 bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-600"
                    placeholder={filename}
                  />
                  <span className="shrink-0 text-[10px] text-slate-600">.csv</span>
                </div>
              </div>

              <hr className="border-white/10" />

              {/* Available columns */}
              <div className="flex-1">
                <div className="mb-2.5 flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Columnas disponibles
                  </span>
                  {availableColumns.length > 0 && (
                    <span className="rounded-full border border-slate-600/40 bg-slate-700/40 px-1.5 py-0.5 text-[9px] font-bold text-slate-400">
                      {availableColumns.length}
                    </span>
                  )}
                </div>
                {availableColumns.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {availableColumns.map((col) => (
                      <button
                        key={col.key}
                        onClick={() => setActiveColumns((prev) => [...prev, col])}
                        className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-indigo-500/40 hover:bg-indigo-500/10 hover:text-indigo-300"
                      >
                        <Plus size={10} /> {col.label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-600">Todas las columnas están activas</p>
                )}
              </div>
            </div>

            {/* Right — active columns */}
            <div className="flex w-[48%] flex-col overflow-hidden px-5 py-5">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Columnas a exportar
                </span>
                <span className="rounded-full border border-indigo-500/20 bg-indigo-500/15 px-1.5 py-0.5 text-[9px] font-black text-indigo-400">
                  {activeColumns.length}
                </span>
              </div>
              <div className="flex-1 space-y-1.5 overflow-y-auto pr-0.5">
                {activeColumns.map((col, i) => (
                  <div
                    key={col.key}
                    className="group flex items-center gap-2 rounded-lg border border-slate-700/50 bg-slate-800/40 px-3 py-2"
                  >
                    <div className="flex shrink-0 flex-col gap-0.5">
                      <button
                        onClick={() => move(i, -1)}
                        disabled={i === 0}
                        className="rounded p-0.5 text-slate-600 transition-colors hover:text-slate-300 disabled:opacity-0"
                      >
                        <ArrowUp size={12} />
                      </button>
                      <button
                        onClick={() => move(i, 1)}
                        disabled={i === activeColumns.length - 1}
                        className="rounded p-0.5 text-slate-600 transition-colors hover:text-slate-300 disabled:opacity-0"
                      >
                        <ArrowDown size={12} />
                      </button>
                    </div>
                    <span className="min-w-0 flex-1 text-sm text-slate-200">
                      {col.label}
                    </span>
                    <button
                      onClick={() =>
                        setActiveColumns((prev) =>
                          prev.filter((c) => c.key !== col.key),
                        )
                      }
                      className="shrink-0 rounded p-1 text-slate-600 opacity-0 transition-all hover:bg-rose-500/10 hover:text-rose-400 group-hover:opacity-100"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))}
                {activeColumns.length === 0 && (
                  <p className="rounded-lg border border-dashed border-white/10 py-6 text-center text-xs text-slate-500">
                    Sin columnas seleccionadas
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-white/10 px-6 py-4">
            <button
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-300 transition-colors hover:bg-slate-700"
            >
              Cancelar
            </button>
            <button
              onClick={handleDownload}
              disabled={!canDownload}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-px active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {isDownloading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Generando...
                </>
              ) : (
                <>
                  <Download size={16} /> Descargar CSV
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
