import { Button } from '@core/ui/Button';
import { Input } from '@core/ui/Input';
import { Textarea } from '@core/ui/Textarea';
import { useContactsList } from '@crm/hooks/useContacts';
import { useCreateTask, useUpdateTask } from '@crm/hooks/useCrmTasks';
import { TaskPriority } from '@crm/types/crm';
import { CrmTask } from '@crm/types/crm-task';
import {
  AlertCircle,
  AlignLeft,
  Calendar,
  Check,
  Flag,
  Type,
  User,
  X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface TaskFormSidebarProps {
  open: boolean;
  task: CrmTask | null;
  contactId?: string;
  dealId?: string;
  onClose: () => void;
}

export const TaskFormSidebar: React.FC<TaskFormSidebarProps> = ({
  open,
  task,
  contactId,
  dealId,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium' as TaskPriority,
    contactId: '',
    dealId: '',
  });

  const { data: contactsData } = useContactsList({ limit: 100 });
  const contacts = contactsData?.items || [];
  // Optionally, we could fetch deals here to show a deal selector if not provided.
  // For now we just pass it to the API.

  const createMutation = useCreateTask();
  const updateMutation = useUpdateTask();
  const isSaving = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        dueDate: new Date(task.dueDate).toISOString().slice(0, 16), // datetime-local format
        priority: task.priority,
        contactId: task.contactId || '',
        dealId: task.dealId || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        dueDate: new Date(Date.now() + 86400000).toISOString().slice(0, 16), // Tomorrow
        priority: 'medium',
        contactId: contactId || '',
        dealId: dealId || '',
      });
    }
  }, [task, contactId, dealId, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (task) {
      await updateMutation.mutateAsync({ id: task.id, ...formData });
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
      <div
        className={`fixed inset-y-0 right-0 w-full !mt-0 max-w-md bg-slate-900 border-l border-white/10 z-[70] shadow-2xl transform transition-transform duration-300 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/5 bg-slate-900/50 backdrop-blur-md">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Check
                  size={20}
                  className="text-indigo-400 border-2 border-indigo-400 rounded-md p-0.5"
                />
                {task ? 'Editar Tarea' : 'Nueva Tarea'}
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                {task
                  ? 'Modifica los detalles del recordatorio'
                  : 'Asegura el seguimiento de tu contacto'}
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
          <form
            id="task-form"
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto p-6 space-y-6"
          >
            <Input
              label="Título de la Tarea"
              icon={Type}
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Ej: Llamada de seguimiento, Enviar contrato..."
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Fecha y Hora"
                icon={Calendar}
                type="datetime-local"
                required
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
              />

              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                  <Flag size={14} className="text-slate-500" />
                  Prioridad
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      priority: e.target.value as any,
                    })
                  }
                  className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
                >
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                <User size={14} className="text-slate-500" />
                Vincular Contacto
              </label>
              <select
                value={formData.contactId}
                onChange={(e) =>
                  setFormData({ ...formData, contactId: e.target.value })
                }
                className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
              >
                <option value="">Sin contacto vinculado</option>
                {contacts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-slate-500 ml-1">
                Vincular una tarea a un contacto permite verla en su historial.
              </p>
            </div>

            <Textarea
              label="Descripción o Notas"
              icon={AlignLeft}
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Añade detalles sobre lo que hay que hacer..."
            />

            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex gap-3">
              <AlertCircle size={18} className="text-amber-500 shrink-0" />
              <p className="text-xs text-amber-200/70 leading-relaxed">
                Las tareas vencidas aparecerán resaltadas en rojo en tu panel
                central para que no pierdas ningún seguimiento.
              </p>
            </div>
          </form>

          {/* Footer */}
          <div className="p-6 border-t border-white/5 bg-slate-900/50 backdrop-blur-md">
            <div className="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                form="task-form"
                type="submit"
                disabled={!formData.title}
                loading={isSaving}
                icon={Check}
                className="flex-[2]"
              >
                {task ? 'Guardar Cambios' : 'Crear Tarea'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
