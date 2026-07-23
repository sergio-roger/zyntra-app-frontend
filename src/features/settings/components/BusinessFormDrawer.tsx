import { Button } from '@core/ui/Button';
import { Input } from '@core/ui/Input';
import { useUpdateBusiness } from '@features/settings/hooks/useBusiness';
import {
  UpdateBusinessFormValues,
  updateBusinessSchema,
} from '@features/settings/schemas/business.schema';
import { Business } from '@features/settings/types/settings';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Building2,
  FileText,
  Globe,
  Mail,
  MapPin,
  Phone,
  Save,
  X,
} from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';

interface BusinessFormDrawerProps {
  open: boolean;
  business?: Business;
  onClose: () => void;
}

export const BusinessFormDrawer: React.FC<BusinessFormDrawerProps> = ({
  open,
  business,
  onClose,
}) => {
  const updateBusiness = useUpdateBusiness();

  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields, isSubmitting },
  } = useForm<UpdateBusinessFormValues>({
    resolver: zodResolver(updateBusinessSchema),
    values: {
      name: business?.name ?? '',
      email: business?.email ?? '',
      phone: business?.phone ?? '',
      address: business?.address ?? '',
      taxId: business?.taxId ?? '',
      website: business?.website ?? '',
    },
  });

  const onSubmit = async (data: UpdateBusinessFormValues) => {
    const changedKeys = Object.keys(dirtyFields) as Array<
      keyof UpdateBusinessFormValues
    >;
    if (changedKeys.length === 0) {
      onClose();
      return;
    }

    const payload: Record<string, string> = {};
    changedKeys.forEach((key) => {
      payload[key] = data[key] ?? '';
    });

    await updateBusiness.mutateAsync(payload);
    onClose();
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 !mt-0 backdrop-blur-sm z-[60] transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <div
        className={`fixed inset-y-0 right-0 w-full !mt-0 max-w-lg bg-slate-900 border-l border-white/10 z-[70] shadow-2xl transform transition-transform duration-300 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-white/5 bg-slate-900/50 backdrop-blur-md">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Building2 size={20} className="text-indigo-400" />
                Editar empresa
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                Actualiza los datos de contacto y facturación.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          <form
            id="business-form"
            onSubmit={handleSubmit(onSubmit)}
            className="flex-1 overflow-y-auto p-6 space-y-6"
          >
            <FormSection
              title="Identidad"
              description="Cómo se identifica tu empresa dentro de la plataforma."
            >
              <Input
                label="Nombre de la empresa"
                icon={Building2}
                hint="Se muestra en el widget de chat, comprobantes y correos enviados a tus clientes."
                error={errors.name?.message}
                {...register('name')}
              />
            </FormSection>

            <FormSection
              title="Contacto"
              description="Datos con los que tus clientes pueden encontrarte."
            >
              <div className="space-y-4">
                <Input
                  label="Correo de contacto"
                  icon={Mail}
                  hint="Correo principal de atención al cliente."
                  error={errors.email?.message}
                  {...register('email')}
                />
                <Input
                  label="Teléfono"
                  icon={Phone}
                  hint="Visible en tus canales de atención."
                  error={errors.phone?.message}
                  {...register('phone')}
                />
                <Input
                  label="Sitio web"
                  icon={Globe}
                  hint="Se muestra en tu perfil público."
                  error={errors.website?.message}
                  {...register('website')}
                />
              </div>
            </FormSection>

            <FormSection
              title="Facturación"
              description="Datos usados al emitir comprobantes de pago."
            >
              <div className="space-y-4">
                <Input
                  label="Dirección"
                  icon={MapPin}
                  hint="Dirección fiscal registrada de la empresa."
                  error={errors.address?.message}
                  {...register('address')}
                />
                <Input
                  label="RUC / Identificación fiscal"
                  icon={FileText}
                  hint="Requerido para emitir comprobantes válidos."
                  error={errors.taxId?.message}
                  {...register('taxId')}
                />
              </div>
            </FormSection>
          </form>

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
                form="business-form"
                type="submit"
                disabled={isSubmitting}
                loading={updateBusiness.isPending}
                icon={Save}
                className="flex-[2]"
              >
                Guardar cambios
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const FormSection: React.FC<{
  title: string;
  description?: string;
  children: React.ReactNode;
}> = ({ title, description, children }) => (
  <section className="space-y-3">
    <div>
      <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">
        {title}
      </h4>
      {description && (
        <p className="mt-0.5 text-[11px] text-slate-500">{description}</p>
      )}
    </div>
    {children}
  </section>
);
