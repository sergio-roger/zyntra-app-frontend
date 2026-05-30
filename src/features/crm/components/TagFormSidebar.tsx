import React, { useEffect, useState } from 'react';
import { 
  X, 
  Check, 
  Loader2, 
  Tag as TagIcon,
  Type,
  Palette,
  AlignLeft
} from 'lucide-react';
import { Input } from '@core/ui/Input';
import { Textarea } from '@core/ui/Textarea';
import { useCreateTag, useUpdateTag } from '@crm/hooks/useTags';
import type { Tag } from '@crm/types';

interface TagFormSidebarProps {
  open: boolean;
  tag: Tag | null;
  onClose: () => void;
}

export const TagFormSidebar: React.FC<TagFormSidebarProps> = ({ open, tag, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    color: '#6366f1',
    description: '',
  });

  const createMutation = useCreateTag();
  const updateMutation = useUpdateTag();
  const isSaving = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (tag) {
      setFormData({
        name: tag.name,
        color: tag.color,
        description: tag.description || '',
      });
    } else {
      setFormData({
        name: '',
        color: '#6366f1',
        description: '',
      });
    }
  }, [tag, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tag) {
      await updateMutation.mutateAsync({ id: tag.id, ...formData });
    } else {
      await createMutation.mutateAsync(formData);
    }
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 !mt-0 backdrop-blur-sm z-[60] transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className={`fixed inset-y-0 right-0 w-full !mt-0 max-w-md bg-slate-900 border-l border-white/10 z-[70] shadow-2xl transform transition-transform duration-300 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/5 bg-slate-900/50 backdrop-blur-md">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <TagIcon size={20} className="text-indigo-400" />
                {tag ? 'Editar Etiqueta' : 'Nueva Etiqueta'}
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                {tag ? 'Modifica los detalles de la etiqueta' : 'Crea una nueva etiqueta para segmentar'}
              </p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form id="tag-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
            <Input
              label="Nombre de la Etiqueta"
              icon={Type}
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ej: Cliente VIP, Prospecto Frío..."
            />

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                <Palette size={14} className="text-slate-500" />
                Color Identificador
              </label>
              <div className="flex items-center gap-4 bg-slate-950/50 p-4 rounded-2xl border border-white/10">
                <div className="relative">
                  <input 
                    type="color" 
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="h-12 w-12 rounded-xl bg-transparent border-none cursor-pointer absolute inset-0 opacity-0"
                  />
                  <div 
                    className="h-12 w-12 rounded-xl border border-white/10 shadow-lg"
                    style={{ backgroundColor: formData.color }}
                  />
                </div>
                <div className="flex-1">
                  <input 
                    type="text" 
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full bg-transparent border-none p-0 text-sm font-mono text-white focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-500 mt-0.5">Código Hexadecimal</p>
                </div>
              </div>
            </div>

            <Textarea
              label="Descripción (Opcional)"
              icon={AlignLeft}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Indica el propósito de esta etiqueta..."
              rows={4}
            />

            <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
              <p className="text-xs text-indigo-300 leading-relaxed">
                <strong>Consejo:</strong> Usa colores contrastantes para diferenciar rápidamente los tipos de contactos en tu lista y pipeline.
              </p>
            </div>
          </form>

          {/* Footer */}
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
                form="tag-form"
                type="submit"
                disabled={isSaving}
                className="flex-[2] px-4 py-3 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Check size={18} />
                )}
                {tag ? 'Guardar Cambios' : 'Crear Etiqueta'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
