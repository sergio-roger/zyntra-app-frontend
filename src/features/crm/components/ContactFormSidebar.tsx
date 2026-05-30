import { useCreateContact, useUpdateContact } from '@crm/hooks/useContacts';
import { useTags } from '@crm/hooks/useTags';
import { useCustomFields } from '@crm/hooks/useCustomFields';
import type { Contact } from '@crm/types';
import { 
  ChevronRight, 
  Loader2, 
  Mail, 
  Phone, 
  Save, 
  StickyNote, 
  User, 
  X,
  Tag as TagIcon,
  Settings2,
  Check,
  Target
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Input } from '@core/ui/Input';
import { Textarea } from '@core/ui/Textarea';

interface LifecycleStage {
  id: string;
  name: string;
  icon: string;
  type: 'active' | 'lost';
}

interface ContactFormSidebarProps {
  open: boolean;
  contact: Contact | null;
  stages: LifecycleStage[];
  onClose: () => void;
}

export const ContactFormSidebar: React.FC<ContactFormSidebarProps> = ({
  open,
  contact,
  stages,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    stage: 'lead' as any,
    lifecycle_stage_id: '',
    source: 'manual',
    tags: [] as string[],
    notes: '',
    custom_fields: {} as Record<string, any>,
  });

  const [activeTab, setActiveTab] = useState<'info' | 'advanced'>('info');

  const { data: availableTags = [] } = useTags();
  const { data: availableFields = [] } = useCustomFields();

  const createMutation = useCreateContact();
  const updateMutation = useUpdateContact();
  const isSaving = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (contact) {
      setFormData({
        name: contact.name,
        email: contact.email || '',
        phone: contact.phone || '',
        stage: contact.stage || 'lead',
        lifecycle_stage_id: contact.lifecycle_stage_id || '',
        source: contact.source || 'manual',
        tags: contact.tags?.map((t: any) => typeof t === 'string' ? t : t.id) || [],
        notes: contact.notes || '',
        custom_fields: contact.custom_fields || {},
      });
    } else {
      const firstActiveStage = stages.find((s) => s.type === 'active');
      setFormData({
        name: '',
        email: '',
        phone: '',
        stage: 'lead',
        lifecycle_stage_id: firstActiveStage?.id || '',
        source: 'manual',
        tags: [],
        notes: '',
        custom_fields: {},
      });
    }
    setActiveTab('info'); // Reset tab on open/change
  }, [contact, stages, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (contact) {
      await updateMutation.mutateAsync({ id: contact.id, input: formData });
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
          <div className="flex items-center justify-between p-6 border-b border-white/5">
            <div>
              <h3 className="text-xl font-bold text-white">
                {contact ? 'Editar contacto' : 'Nuevo contacto'}
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                {contact ? 'Actualiza la información del lead' : 'Crea un nuevo prospecto manualmente'}
              </p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Tabs Switcher */}
          <div className="flex p-1 bg-slate-950/50 mx-6 mt-6 rounded-xl border border-white/5">
            <button
              onClick={() => setActiveTab('info')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                activeTab === 'info' 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <User size={14} />
              Información
            </button>
            <button
              onClick={() => setActiveTab('advanced')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                activeTab === 'advanced' 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Settings2 size={14} />
              Avanzado
            </button>
          </div>

          {/* Form Content */}
          <form id="contact-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8">
            {activeTab === 'info' ? (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                {/* Info Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
                    <User size={14} />
                    Información básica
                  </div>
                  
                  <div className="space-y-3">
                    <Input
                      label="Nombre completo"
                      icon={User}
                      required
                      placeholder="Ej: Juan Pérez"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />

                    <div className="grid grid-cols-1 gap-3">
                      <Input
                        label="Email"
                        icon={Mail}
                        type="email"
                        placeholder="juan@ejemplo.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                      
                      <Input
                        label="Teléfono"
                        icon={Phone}
                        type="tel"
                        placeholder="+1 234 567 890"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>

                    {!contact && (
                      <div className="pt-2">
                        <label className="flex items-center gap-3 p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 cursor-pointer group hover:bg-indigo-500/15 transition-all">
                          <div className="relative flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.stage === 'lead'}
                              onChange={(e) => setFormData({ ...formData, stage: e.target.checked ? 'lead' : '' })}
                              className="peer h-5 w-5 rounded border-indigo-500/40 bg-slate-800 text-indigo-500 focus:ring-indigo-500/20 appearance-none"
                            />
                            <Check
                              size={14}
                              className="absolute left-0.5 top-0.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Target size={14} className="text-indigo-400" />
                              <span className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                                Crear como lead
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              Aparecerá en el inbox de leads para seguimiento.
                            </p>
                          </div>
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* Lifecycle Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
                    <ChevronRight size={14} />
                    Estado del Ciclo de Vida
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {stages.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, lifecycle_stage_id: s.id })}
                        className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all ${
                          formData.lifecycle_stage_id === s.id 
                            ? 'bg-primary/10 border-primary text-white shadow-lg shadow-primary/10' 
                            : 'bg-slate-950/30 border-white/5 text-slate-400 hover:border-white/20'
                        }`}
                      >
                        <span className="text-lg">{s.icon}</span>
                        <span className="text-xs font-medium truncate">{s.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tags Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
                    <TagIcon size={14} />
                    Etiquetas
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag) => {
                      const isSelected = formData.tags.includes(tag.id);
                      return (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => {
                            const newTags = isSelected
                              ? formData.tags.filter((id) => id !== tag.id)
                              : [...formData.tags, tag.id];
                            setFormData({ ...formData, tags: newTags });
                          }}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all ${
                            isSelected 
                              ? 'text-white border-transparent' 
                              : 'bg-slate-950/30 border-white/5 text-slate-400 hover:border-white/10'
                          }`}
                          style={isSelected ? { backgroundColor: tag.color } : {}}
                        >
                          <span className="text-xs font-medium">{tag.name}</span>
                          {isSelected && <Check size={12} />}
                        </button>
                      );
                    })}
                    {availableTags.length === 0 && (
                      <p className="text-xs text-slate-500 italic">No hay etiquetas creadas.</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
                {/* Custom Fields Section */}
                {availableFields.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
                      <Settings2 size={14} />
                      Campos Personalizados
                    </div>
                    <div className="space-y-3">
                      {availableFields.map((field) => (
                        <div key={field.id}>
                          {field.type === 'select' ? (
                            <div className="space-y-1.5">
                              <label className="text-xs font-medium text-slate-400 ml-1">
                                {field.label} {field.required && '*'}
                              </label>
                              <select
                                required={field.required}
                                value={formData.custom_fields[field.name] || ''}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  custom_fields: { ...formData.custom_fields, [field.name]: e.target.value }
                                })}
                                className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all appearance-none"
                              >
                                <option value="">Seleccionar...</option>
                                {field.options?.map((opt) => (
                                  <option key={opt} value={opt}>{opt}</option>
                                ))}
                              </select>
                            </div>
                          ) : field.type === 'checkbox' ? (
                            <div className="space-y-1.5">
                              <label className="text-xs font-medium text-slate-400 ml-1">
                                {field.label} {field.required && '*'}
                              </label>
                              <div className="flex items-center gap-3 bg-slate-950/50 border border-white/10 rounded-xl p-3">
                                <input
                                  type="checkbox"
                                  checked={!!formData.custom_fields[field.name]}
                                  onChange={(e) => setFormData({
                                    ...formData,
                                    custom_fields: { ...formData.custom_fields, [field.name]: e.target.checked }
                                  })}
                                  className="h-5 w-5 rounded border-white/10 bg-slate-800 text-primary focus:ring-primary/20"
                                />
                                <span className="text-sm text-slate-300">Habilitado</span>
                              </div>
                            </div>
                          ) : (
                            <Input
                              label={field.label}
                              required={field.required}
                              type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                              value={formData.custom_fields[field.name] || ''}
                              onChange={(e) => setFormData({
                                ...formData,
                                custom_fields: { ...formData.custom_fields, [field.name]: e.target.value }
                              })}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 opacity-30 border-2 border-dashed border-white/10 rounded-2xl">
                    <Settings2 size={24} className="mb-2" />
                    <p className="text-xs text-slate-500">No hay campos personalizados</p>
                  </div>
                )}

                {/* Additional Info */}
                <div className="space-y-4">
                  <Textarea
                    label="Notas adicionales"
                    icon={StickyNote}
                    rows={6}
                    placeholder="Escribe aquí cualquier detalle importante..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
              </div>
            )}
          </form>

          {/* Footer Actions */}
          <div className="p-6 border-t border-white/5 bg-slate-950/30 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-sm font-semibold text-slate-300 hover:bg-white/5 transition-colors"
            >
              Cancelar
            </button>
            <button
              form="contact-form"
              type="submit"
              disabled={isSaving || !formData.name}
              className="flex-[2] px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold shadow-lg shadow-primary/20 hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Save size={18} />
              )}
              {contact ? 'Actualizar contacto' : 'Guardar contacto'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
