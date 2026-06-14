import React, { useState, useRef } from 'react';
import { 
  Upload, 
  X, 
  Check, 
  FileSpreadsheet, 
  ArrowRight, 
  Loader2, 
  AlertCircle
} from 'lucide-react';
import api from '@shared/api/axios';
import { useQueryClient } from '@tanstack/react-query';

interface ContactImportModalProps {
  open: boolean;
  onClose: () => void;
}

type Step = 'upload' | 'mapping' | 'preview' | 'importing' | 'success';

const CRM_FIELDS = [
  { id: 'name', label: 'Nombre Completo', required: true },
  { id: 'email', label: 'Email', required: false },
  { id: 'phone', label: 'Teléfono', required: false },
  { id: 'notes', label: 'Notas', required: false },
];

export const ContactImportModal: React.FC<ContactImportModalProps> = ({ open, onClose }) => {
  const [step, setStep] = useState<Step>('upload');
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ success: 0, failed: 0 });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  if (!open) return null;

  const reset = () => {
    setStep('upload');
    setHeaders([]);
    setRows([]);
    setMapping({});
    setError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    if (!selectedFile.name.endsWith('.csv')) {
      setError('Por favor, selecciona un archivo CSV válido.');
      return;
    }

    processFile(selectedFile);
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
      
      if (lines.length < 2) {
        setError('El archivo parece estar vacío o no tiene suficientes filas.');
        return;
      }

      // Basic CSV Parser (Handles simple quotes)
      const parseLine = (line: string) => {
        const result = [];
        let cur = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          if (char === '"') inQuotes = !inQuotes;
          else if (char === ',' && !inQuotes) {
            result.push(cur.replace(/^"|"$/g, '').trim());
            cur = '';
          } else cur += char;
        }
        result.push(cur.replace(/^"|"$/g, '').trim());
        return result;
      };

      const allRows = lines.map(parseLine);
      const csvHeaders = allRows[0];
      const dataRows = allRows.slice(1);

      setHeaders(csvHeaders);
      setRows(dataRows);
      
      // Auto-mapping logic
      const initialMapping: Record<string, string> = {};
      csvHeaders.forEach((header, index) => {
        const h = header.toLowerCase();
        if (h.includes('nombre') || h.includes('name') || h.includes('completo')) initialMapping['name'] = index.toString();
        if (h.includes('email') || h.includes('correo')) initialMapping['email'] = index.toString();
        if (h.includes('tel') || h.includes('phone') || h.includes('cel')) initialMapping['phone'] = index.toString();
        if (h.includes('not') || h.includes('obs')) initialMapping['notes'] = index.toString();
      });
      
      setMapping(initialMapping);
      setStep('mapping');
      setError(null);
    };
    reader.readAsText(file);
  };

  const handleStartImport = async () => {
    if (!mapping['name']) {
      setError('El campo "Nombre" es obligatorio para realizar la importación.');
      return;
    }

    setStep('importing');

    try {
      const contactsToImport = rows.map(row => {
        const contact: any = {};
        Object.entries(mapping).forEach(([crmField, csvIndex]) => {
          const val = row[parseInt(csvIndex)];
          if (val) contact[crmField] = val;
        });
        return contact;
      }).filter(c => c.name);

      const response = await api.post('/crm/contacts/import', contactsToImport);
      setStats({ success: response.data.count, failed: 0 });
      setStep('success');
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ocurrió un error durante la importación.');
      setStep('mapping');
    } finally {
      // Import process completed
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
              <FileSpreadsheet size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Importar Contactos</h3>
              <p className="text-xs text-slate-400">Carga masiva mediante archivo CSV</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-500 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {step === 'upload' && (
            <div className="space-y-6">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="group relative border-2 border-dashed border-white/10 rounded-3xl p-12 flex flex-col items-center justify-center gap-4 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all cursor-pointer"
              >
                <div className="p-4 rounded-2xl bg-slate-800 text-slate-400 group-hover:bg-indigo-500 group-hover:text-white transition-all shadow-xl">
                  <Upload size={32} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-white">Haz clic para subir o arrastra tu archivo</p>
                  <p className="text-xs text-slate-500 mt-1">Soportamos archivos .csv (separados por comas)</p>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".csv"
                  className="hidden" 
                />
              </div>

              <div className="bg-slate-950/50 rounded-2xl p-4 border border-white/5">
                <div className="flex gap-3">
                  <AlertCircle size={18} className="text-indigo-400 shrink-0" />
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-300">Recomendaciones:</p>
                    <ul className="text-[11px] text-slate-500 space-y-1 list-disc ml-3">
                      <li>Asegúrate de que la primera fila contenga los títulos de las columnas.</li>
                      <li>El archivo debe estar codificado en UTF-8 para evitar errores de caracteres.</li>
                      <li>El campo 'Nombre' es indispensable para crear el contacto.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 'mapping' && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-200">Mapeo de Columnas</h4>
                <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded-md border border-indigo-500/20 font-bold uppercase tracking-wider">
                  {headers.length} Columnas Detectadas
                </span>
              </div>

              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {CRM_FIELDS.map((field) => (
                  <div key={field.id} className="flex items-center gap-4 bg-slate-950/30 p-3 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                    <div className="flex-1">
                      <p className="text-xs font-bold text-white">
                        {field.label} {field.required && <span className="text-rose-500">*</span>}
                      </p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-tighter font-mono mt-0.5">Campo CRM</p>
                    </div>
                    <ArrowRight size={14} className="text-slate-600" />
                    <select 
                      value={mapping[field.id] || ''}
                      onChange={(e) => setMapping({ ...mapping, [field.id]: e.target.value })}
                      className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Ignorar columna</option>
                      {headers.map((h, i) => (
                        <option key={i} value={i}>{h}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-2 text-rose-400 text-xs animate-in shake duration-500">
                  <AlertCircle size={14} />
                  {error}
                </div>
              )}
            </div>
          )}

          {step === 'importing' && (
            <div className="py-12 flex flex-col items-center justify-center gap-4 animate-in fade-in">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-xl animate-pulse" />
                <Loader2 size={48} className="text-indigo-500 animate-spin relative" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-white">Procesando {rows.length} registros...</p>
                <p className="text-xs text-slate-500 mt-1">Estamos validando y guardando tus contactos.</p>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="py-8 flex flex-col items-center justify-center gap-6 animate-in zoom-in duration-500">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)]">
                <Check size={40} />
              </div>
              <div className="text-center">
                <h4 className="text-xl font-bold text-white">¡Importación Exitosa!</h4>
                <p className="text-sm text-slate-400 mt-1">Se han procesado correctamente todos tus contactos.</p>
              </div>
              <div className="flex gap-4 w-full">
                <div className="flex-1 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-4 text-center">
                  <p className="text-2xl font-black text-emerald-500">{stats.success}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Importados</p>
                </div>
                <div className="flex-1 bg-slate-950/30 border border-white/5 rounded-2xl p-4 text-center opacity-50">
                  <p className="text-2xl font-black text-white">{stats.failed}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Errores</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 bg-slate-900/50 flex gap-3">
          {step === 'upload' ? (
            <button 
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-slate-800 text-slate-300 text-sm font-bold hover:bg-slate-700 transition-all"
            >
              Cancelar
            </button>
          ) : step === 'mapping' ? (
            <>
              <button 
                onClick={reset}
                className="flex-1 py-3 rounded-xl border border-white/10 text-slate-300 text-sm font-bold hover:bg-white/5 transition-all"
              >
                Cambiar archivo
              </button>
              <button 
                onClick={handleStartImport}
                className="flex-[2] py-3 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
              >
                Comenzar Importación
              </button>
            </>
          ) : step === 'success' ? (
            <button 
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-500/20"
            >
              Cerrar y Ver Contactos
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};
