import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import {
  contactSchema,
  type ContactFormValues,
} from '@crm/schemas/contact.schema';
import {
  STAGES,
  SOURCES,
  STAGE_LABELS,
  SOURCE_LABELS,
  type Contact,
  type ContactSource,
  type ContactStage,
} from '@crm/types';
import { useCreateContact, useUpdateContact } from '@crm/hooks/useContacts';
import { mapAuthError } from '@features/auth/lib/mapAuthError';

interface ContactFormModalProps {
  open: boolean;
  contact: Contact | null;
  onClose: () => void;
}

export const ContactFormModal: React.FC<ContactFormModalProps> = ({
  open,
  contact,
  onClose,
}) => {
  const isEdit = Boolean(contact);
  const createMutation = useCreateContact();
  const updateMutation = useUpdateContact();
  const [serverError, setServerError] = React.useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      stage: 'lead',
      source: 'manual',
      notes: '',
      tags: [],
    },
  });

  useEffect(() => {
    if (open) {
      reset(
        contact
          ? {
              name: contact.name,
              email: contact.email ?? '',
              phone: contact.phone ?? '',
              stage: contact.stage,
              source: contact.source,
              notes: contact.notes ?? '',
              tags: contact.tags?.map((t: any) => typeof t === 'string' ? t : t.id) || [],
            }
          : {
              name: '',
              email: '',
              phone: '',
              stage: 'lead',
              source: 'manual',
              notes: '',
              tags: [],
            },
      );
      if (serverError !== '') {
        const timer = setTimeout(() => setServerError(''), 0);
        return () => clearTimeout(timer);
      }
    }
  }, [contact, open, reset]);

  if (!open) return null;

  const onSubmit = async (values: ContactFormValues) => {
    setServerError('');
    const empty = (s: string | undefined) => (s && s.trim() ? s : undefined);
    const payload = {
      name: values.name,
      email: empty(values.email),
      phone: empty(values.phone),
      notes: empty(values.notes),
      tags: values.tags,
      stage: values.stage as ContactStage | undefined,
      source: values.source as ContactSource | undefined,
    };
    try {
      if (isEdit && contact) {
        await updateMutation.mutateAsync({ id: contact.id, input: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      onClose();
    } catch (err) {
      setServerError(mapAuthError(err));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-3 right-3 rounded-md p-1.5 text-slate-400 transition-colors hover:bg-white/5 hover:text-slate-100"
        >
          <X size={18} />
        </button>

        <h2 className="mb-1 text-xl font-semibold text-slate-100">
          {isEdit ? 'Editar contacto' : 'Nuevo contacto'}
        </h2>
        <p className="mb-5 text-sm text-slate-400">
          {isEdit
            ? 'Actualiza los datos del contacto.'
            : 'Añade un nuevo contacto a tu CRM.'}
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div>
            <label className="text-xs font-medium text-slate-300">Nombre</label>
            <input
              {...register('name')}
              className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-rose-400">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-slate-300">Email</label>
              <input
                type="email"
                {...register('email')}
                className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-rose-400">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label className="text-xs font-medium text-slate-300">Teléfono</label>
              <input
                {...register('phone')}
                className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-slate-300">Stage</label>
              <select
                {...register('stage')}
                className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400"
              >
                {STAGES.map((s) => (
                  <option key={s} value={s}>
                    {STAGE_LABELS[s]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-300">Origen</label>
              <select
                {...register('source')}
                className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400"
              >
                {SOURCES.map((s) => (
                  <option key={s} value={s}>
                    {SOURCE_LABELS[s]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300">Notas</label>
            <textarea
              rows={3}
              {...register('notes')}
              className="mt-1 w-full resize-none rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30"
            />
          </div>

          {serverError && (
            <div
              role="alert"
              className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300"
            >
              {serverError}
            </div>
          )}

          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-white/10 bg-slate-900 px-4 py-2 text-sm text-slate-200 transition-colors hover:bg-white/5"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-px hover:shadow-xl disabled:opacity-50"
            >
              {isSubmitting ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear contacto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
