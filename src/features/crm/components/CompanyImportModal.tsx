import React, { useRef, useState } from 'react';
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  FileSpreadsheet,
  Loader2,
  Upload,
  X,
} from 'lucide-react';
import { companiesApi } from '@crm/api/companies.api';
import { useQueryClient } from '@tanstack/react-query';
import { companiesKeys } from '@crm/hooks/useCompanies';

type Step = 'upload' | 'preview' | 'importing' | 'success';

interface ParsedRow {
  name: string;
  identification?: string;
  website?: string;
  num_employees?: number;
  description?: string;
}

interface CompanyImportModalProps {
  open: boolean;
  onClose: () => void;
}

const HEADER_MAP: Record<string, keyof ParsedRow> = {
  nombre: 'name',
  name: 'name',
  empresa: 'name',
  company: 'name',
  ruc: 'identification',
  identificacion: 'identification',
  identificación: 'identification',
  identification: 'identification',
  nit: 'identification',
  web: 'website',
  website: 'website',
  sitio: 'website',
  url: 'website',
  empleados: 'num_employees',
  employees: 'num_employees',
  num_employees: 'num_employees',
  descripcion: 'description',
  descripción: 'description',
  description: 'description',
  notas: 'description',
};

function parseCSV(text: string): ParsedRow[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];

  const rawHeaders = lines[0].split(',').map((h) =>
    h
      .trim()
      .replace(/^["']|["']$/g, '')
      .toLowerCase(),
  );

  const fieldMap: (keyof ParsedRow | null)[] = rawHeaders.map(
    (h) => HEADER_MAP[h] ?? null,
  );

  const rows: ParsedRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cells = lines[i]
      .split(',')
      .map((c) => c.trim().replace(/^["']|["']$/g, ''));
    const obj: Partial<ParsedRow> = {};
    fieldMap.forEach((field, idx) => {
      if (!field) return;
      const val = cells[idx]?.trim();
      if (!val) return;
      if (field === 'num_employees') {
        const n = parseInt(val, 10);
        if (!isNaN(n)) obj.num_employees = n;
      } else {
        (obj as any)[field] = val;
      }
    });
    if (obj.name) rows.push(obj as ParsedRow);
  }
  return rows;
}

export const CompanyImportModal: React.FC<CompanyImportModalProps> = ({
  open,
  onClose,
}) => {
  const [step, setStep] = useState<Step>('upload');
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [importedCount, setImportedCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const qc = useQueryClient();

  const reset = () => {
    setStep('upload');
    setParsedRows([]);
    setImportedCount(0);
    setError(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFile = (file: File) => {
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const rows = parseCSV(text);
        if (rows.length === 0) {
          setError(
            'No se encontraron filas válidas. Asegúrate de que el CSV tenga una columna "nombre" o "name".',
          );
          return;
        }
        setParsedRows(rows);
        setStep('preview');
      } catch {
        setError('Error al leer el archivo. Usa formato CSV UTF-8.');
      }
    };
    reader.readAsText(file, 'utf-8');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleImport = async () => {
    setStep('importing');
    try {
      const res = await companiesApi.import(parsedRows);
      setImportedCount((res as any)?.data?.count ?? parsedRows.length);
      qc.invalidateQueries({ queryKey: companiesKeys.all });
      setStep('success');
    } catch {
      setError('Error al importar. Verifica los datos e intenta de nuevo.');
      setStep('preview');
    }
  };

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <div
          className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
            <div>
              <h2 className="text-base font-bold text-white">
                Importar empresas
              </h2>
              <p className="mt-0.5 text-xs text-slate-400">
                Sube un archivo CSV con tus empresas
              </p>
            </div>
            <button
              onClick={handleClose}
              className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* Upload step */}
            {step === 'upload' && (
              <>
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => fileRef.current?.click()}
                  className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-white/10 bg-slate-800/30 px-6 py-12 cursor-pointer hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-all"
                >
                  <Upload size={32} className="text-slate-500" />
                  <div className="text-center">
                    <p className="text-sm font-medium text-slate-300">
                      Arrastra tu CSV aquí o{' '}
                      <span className="text-indigo-400">
                        haz clic para elegir
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Solo archivos .csv · UTF-8 recomendado
                    </p>
                  </div>
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".csv,text/csv"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleFile(f);
                    }}
                  />
                </div>

                <div className="rounded-xl border border-white/5 bg-slate-800/30 px-4 py-3 text-xs text-slate-400 space-y-1">
                  <p className="font-semibold text-slate-300">
                    Columnas soportadas:
                  </p>
                  <p>
                    <span className="text-indigo-300 font-mono">nombre</span>{' '}
                    (requerido),{' '}
                    <span className="font-mono text-slate-400">
                      ruc / identificación, web, empleados, descripción
                    </span>
                  </p>
                </div>

                {error && (
                  <div className="flex items-start gap-2 rounded-lg border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-xs text-rose-300">
                    <AlertCircle size={14} className="mt-0.5 shrink-0" />
                    {error}
                  </div>
                )}
              </>
            )}

            {/* Preview step */}
            {step === 'preview' && (
              <>
                <div className="flex items-center gap-3 rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-4 py-3 text-sm">
                  <FileSpreadsheet
                    size={16}
                    className="text-indigo-400 shrink-0"
                  />
                  <p className="text-indigo-300">
                    Se importarán{' '}
                    <span className="font-bold">
                      {parsedRows.length} empresa
                      {parsedRows.length !== 1 ? 's' : ''}
                    </span>
                    . Las empresas con nombre duplicado serán omitidas.
                  </p>
                </div>

                <div className="max-h-64 overflow-y-auto rounded-xl border border-white/10">
                  <table className="w-full text-xs">
                    <thead className="border-b border-white/10 bg-slate-900/80 text-slate-400">
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold">
                          Nombre
                        </th>
                        <th className="px-3 py-2 text-left font-semibold">
                          Identificación
                        </th>
                        <th className="px-3 py-2 text-left font-semibold">
                          Web
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {parsedRows.slice(0, 50).map((r, i) => (
                        <tr
                          key={i}
                          className="border-b border-white/5 last:border-0 hover:bg-white/5"
                        >
                          <td className="px-3 py-2 text-slate-200 font-medium">
                            <span className="flex items-center gap-1.5">
                              <Building2 size={11} className="text-slate-500" />
                              {r.name}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-slate-400">
                            {r.identification ?? '—'}
                          </td>
                          <td className="px-3 py-2 text-slate-400 truncate max-w-[100px]">
                            {r.website ?? '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {parsedRows.length > 50 && (
                    <p className="px-3 py-2 text-center text-[10px] text-slate-500">
                      … y {parsedRows.length - 50} más
                    </p>
                  )}
                </div>

                {error && (
                  <div className="flex items-start gap-2 rounded-lg border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-xs text-rose-300">
                    <AlertCircle size={14} className="mt-0.5 shrink-0" />
                    {error}
                  </div>
                )}
              </>
            )}

            {/* Importing step */}
            {step === 'importing' && (
              <div className="flex flex-col items-center justify-center gap-4 py-10">
                <Loader2 size={36} className="animate-spin text-primary" />
                <p className="text-sm text-slate-400 animate-pulse">
                  Importando {parsedRows.length} empresas...
                </p>
              </div>
            )}

            {/* Success step */}
            {step === 'success' && (
              <div className="flex flex-col items-center justify-center gap-4 py-10">
                <CheckCircle2 size={48} className="text-emerald-400" />
                <div className="text-center">
                  <p className="text-lg font-bold text-white">
                    ¡Importación completada!
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    Se importaron{' '}
                    <span className="font-bold text-emerald-400">
                      {importedCount}
                    </span>{' '}
                    empresas correctamente.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-white/10 px-6 py-4">
            {step === 'upload' && (
              <button
                onClick={handleClose}
                className="rounded-xl border border-white/10 bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-700 transition-colors"
              >
                Cancelar
              </button>
            )}

            {step === 'preview' && (
              <>
                <button
                  onClick={reset}
                  className="rounded-xl border border-white/10 bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-700 transition-colors"
                >
                  Atrás
                </button>
                <button
                  onClick={handleImport}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:-translate-y-px transition-all"
                >
                  <Upload size={15} /> Importar ahora
                </button>
              </>
            )}

            {step === 'success' && (
              <button
                onClick={handleClose}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2 text-sm font-bold text-white hover:bg-emerald-500 transition-colors"
              >
                <CheckCircle2 size={15} /> Listo
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
