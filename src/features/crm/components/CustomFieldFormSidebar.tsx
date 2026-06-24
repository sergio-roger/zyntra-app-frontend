import { useCreateField, useUpdateField } from '@crm/hooks/useCustomFields';
import { CustomField, CustomFieldType } from '@crm/types/crm';
import {
  Check,
  Loader2,
  Settings2,
  X
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { Input } from '@core/ui/Input';

interface CustomFieldFormSidebarProps {
  open: boolean;
  field: CustomField | null;
  onClose: () => void;
}

const FIELD_TYPE_LABELS: Record<CustomFieldType, string> = {
  text: 'Texto corto',
  number: 'Número',
  date: 'Fecha',
  select: 'Selección única',
  checkbox: 'Casilla de verificación',
  url: 'Enlace web',
};

export const CustomFieldFormSidebar: React.FC<CustomFieldFormSidebarProps> = ({ open, field, onClose }) => {
  const [formData, setFormData] = useState({ 
    name: '', 
    label: '', 
    type: 'text' as CustomFieldType, 
    options: [] as string[],
    required: false 
  });
  const [newOption, setNewOption] = useState('');

  const createMutation = useCreateField();
  const updateMutation = useUpdateField();
  const isSaving = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (field) {
      setFormData({ 
        name: field.name, 
        label: field.label, 
        type: field.type, 
        options: field.options || [],
        required: field.required 
      });
    } else {
      setFormData({ name: '', label: '', type: 'text', options: [], required: false });
    }
  }, [field, open]);

  const handleAddOption = () => {
    if (newOption.trim() && !formData.options.includes(newOption.trim())) {
      setFormData({ ...formData, options: [...formData.options, newOption.trim()] });
      setNewOption('');
    }
  };

  const handleRemoveOption = (opt: string) => {
    setFormData({ ...formData, options: formData.options.filter(o => o !== opt) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (field) {
      await updateMutation.mutateAsync({ 
        id: field.id, 
        label: formData.label,
        options: formData.options,
        required: formData.required
      });
    } else {
      await createMutation.mutateAsync(formData);
    }
    onClose();
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/60 !mt-0 backdrop-blur-sm z-[60] transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <div className={`fixed inset-y-0 right-0 w-full !mt-0 max-w-md bg-slate-900 border-l border-white/10 z-[70] shadow-2xl transform transition-transform duration-300 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-white/5 bg-slate-900/50 backdrop-blur-md">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Settings2 size={20} className="text-indigo-400" />
                {field ? 'Editar Campo' : 'Nuevo Campo'}
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                {field ? 'Modifica la configuración del campo' : 'Crea un campo para datos personalizados'}
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-white">
              <X size={20} />
            </button>
          </div>

          <form id="custom-field-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
            {!field && (
              <Input
                label="ID Técnico (Inmutable)"
                required
                pattern="[a-z0-9_]+"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_') })}
                placeholder="ej: fecha_nacimiento"
                className="font-mono"
              />
            )}

            <Input
              label="Etiqueta Visible"
              required
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              placeholder="Ej: Fecha de nacimiento"
            />

            {!field && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tipo de Dato</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(FIELD_TYPE_LABELS).map(([val, label]) => {
                    const isSelected = formData.type === val;
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setFormData({ ...formData, type: val as CustomFieldType })}
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${isSelected ? 'bg-indigo-600/10 border-indigo-500 text-white' : 'bg-slate-800/40 border-white/5 text-slate-400 hover:border-white/10'}`}
                      >
                        <span className="text-xs font-medium">{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {formData.type === 'select' && (
              <div className="space-y-3 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Opciones del Menú</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                    placeholder="Nueva opción..."
                    className="flex-1 px-4 py-2 rounded-xl bg-slate-800 border border-white/5 text-sm text-white focus:outline-none"
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddOption())}
                  />
                  <button 
                    type="button"
                    onClick={handleAddOption}
                    className="px-4 rounded-xl bg-slate-700 text-white hover:bg-slate-600 transition-colors"
                  >
                    Añadir
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.options.map((opt) => (
                    <span key={opt} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-medium border border-indigo-500/20">
                      {opt}
                      <button type="button" onClick={() => handleRemoveOption(opt)} className="hover:text-white">
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-800/30 border border-white/5">
              <input 
                type="checkbox" 
                id="required_sidebar"
                checked={formData.required}
                onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
                className="h-5 w-5 rounded border-white/10 bg-slate-800 text-indigo-600 focus:ring-indigo-500/40"
              />
              <div>
                <label htmlFor="required_sidebar" className="text-sm font-bold text-slate-200 cursor-pointer">Campo Obligatorio</label>
                <p className="text-[10px] text-slate-500">Se requerirá este dato al crear o editar un contacto.</p>
              </div>
            </div>
          </form>

          <div className="p-6 border-t border-white/5 bg-slate-900/50 backdrop-blur-md">
            <div className="flex gap-3">
              <button 
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 rounded-xl bg-slate-800 text-slate-300 text-sm font-bold hover:bg-slate-700 transition-all"
              >
                Cancelar
              </button>
              <button 
                form="custom-field-form"
                type="submit"
                disabled={isSaving}
                className="flex-[2] px-4 py-3 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Check size={18} />
                )}
                {field ? 'Guardar Cambios' : 'Crear Campo'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
