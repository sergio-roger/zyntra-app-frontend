import { Input } from '@core/ui/Input';
import { Select } from '@core/ui/Select';
import { Tabs } from '@core/ui/Tabs';
import { Textarea } from '@core/ui/Textarea';
import { crmApi } from '@crm/api/crm.api';
import { useCreateContact, useUpdateContact } from '@crm/hooks/useContacts';
import { useCustomFields } from '@crm/hooks/useCustomFields';
import { useTags } from '@crm/hooks/useTags';
import { ContactFormData } from '@crm/types/contact-form';
import { Contact, CrmMember, LifecycleStage } from '@crm/types/crm';
import { useAuthStore } from '@features/auth/store/authStore';
import { useQuery } from '@tanstack/react-query';
import {
  Check,
  ChevronRight,
  Loader2,
  Mail,
  Phone,
  Save,
  Settings2,
  StickyNote,
  Tag as TagIcon,
  User,
  UserCheck,
  X
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface ContactFormSidebarProps {
  open: boolean;
  contact: Contact | null;
  onClose: () => void;
}

function formDataFromContact(contact: Contact): ContactFormData {
  return {
    name: contact.name,
    email: contact.email ?? '',
    phone: contact.phone ?? '',
    lifecycleStageId: contact.lifecycleStageId ?? '',
    source: contact.source ?? 'manual',
    ownerId: contact.ownerId ?? null,
    tags: contact.tags?.map((t: any) => (typeof t === 'string' ? t : t.id)) ?? [],
    notes: contact.notes ?? '',
    customFields: contact.customFields ?? {},
  };
}

function defaultFormData(stages: LifecycleStage[], ownerId?: string | null): ContactFormData {
  const firstActiveStage = stages.find((s) => s.type === 'active');
  return {
    name: '',
    email: '',
    phone: '',
    lifecycleStageId: firstActiveStage?.id ?? '',
    source: 'manual',
    ownerId: ownerId ?? null,
    tags: [],
    notes: '',
    customFields: {},
  };
}

export const ContactFormSidebar: React.FC<ContactFormSidebarProps> = ({
  open,
  contact,
  onClose,
}) => {
  const { user } = useAuthStore();

  const { data: stages = [] } = useQuery<LifecycleStage[]>({
    queryKey: ['lifecycle-stages'],
    queryFn: () => import('@shared/api/axios').then(m => m.default.get('/lifecycle/stages').then(r => r.data)),
    staleTime: 10 * 60 * 1000,
  });

  const [formData, setFormData] = useState<ContactFormData>(() => defaultFormData(stages, user?.crm_user_id));

  const [activeTab, setActiveTab] = useState<'info' | 'advanced'>('info');

  const { data: availableTags = [] } = useTags();
  const { data: availableFields = [] } = useCustomFields();
  const { data: members = [] } = useQuery<CrmMember[]>({
    queryKey: ['crm-members'],
    queryFn: () => crmApi.listMembers().then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });

  const createMutation = useCreateContact();
  const updateMutation = useUpdateContact();
  const isSaving = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    setFormData(contact ? formDataFromContact(contact) : defaultFormData(stages, user?.crm_user_id));
    setActiveTab('info');
  }, [contact, stages, open, user]);

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
                {contact ? 'Actualiza la información del prospecto' : 'Crea un nuevo prospecto manualmente'}
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
          <Tabs
            active={activeTab}
            onChange={(k) => setActiveTab(k as 'info' | 'advanced')}
            className="mt-4"
            tabs={[
              { key: 'info', label: 'Información', icon: User },
              { key: 'advanced', label: 'Avanzado', icon: Settings2 },
            ]}
          />

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

                    {members.length > 0 && (user?.role === 'admin' || user?.role === 'superAdmin') && (
                      <Select
                        label="Propietario"
                        icon={UserCheck}
                        options={members.map((m) => ({
                          value: m.id,
                          label: m.id === user?.crm_user_id ? `${m.name} (Yo)` : m.name,
                        }))}
                        value={formData.ownerId}
                        onChange={(v) => setFormData({ ...formData, ownerId: v })}
                        clearable
                        clearLabel="Sin asignar"
                        placeholder="Sin asignar"
                        displayValue={(id) =>
                          id === user?.crm_user_id
                            ? 'Propietario (Yo)'
                            : (members.find((m) => m.id === id)?.name ?? '')
                        }
                      />
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
                        onClick={() => setFormData({ ...formData, lifecycleStageId: s.id })}
                        className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all ${
                          formData.lifecycleStageId === s.id 
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
                                value={formData.customFields[field.name] || ''}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  customFields: { ...formData.customFields, [field.name]: e.target.value }
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
                                  checked={!!formData.customFields[field.name]}
                                  onChange={(e) => setFormData({
                                    ...formData,
                                    customFields: { ...formData.customFields, [field.name]: e.target.checked }
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
                              value={formData.customFields[field.name] || ''}
                              onChange={(e) => setFormData({
                                ...formData,
                                customFields: { ...formData.customFields, [field.name]: e.target.value }
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
