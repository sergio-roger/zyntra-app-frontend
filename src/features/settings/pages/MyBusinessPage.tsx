import { BusinessFormDrawer } from '@features/settings/components/BusinessFormDrawer';
import { BusinessProfileHeader } from '@features/settings/components/BusinessProfileHeader';
import { useBusinessQuery } from '@features/settings/hooks/useBusiness';
import { Business } from '@features/settings/types/settings';
import {
  Calendar,
  CreditCard,
  FileText,
  Globe,
  Hash,
  Loader2,
  LucideIcon,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react';
import React, { useState } from 'react';

const PLAN_STATUS_LABELS: Record<Business['planStatus'], string> = {
  trial: 'Prueba',
  active: 'Activo',
  past_due: 'Pago pendiente',
  cancelled: 'Cancelado',
};

const PLAN_STATUS_COLORS: Record<Business['planStatus'], string> = {
  trial: 'text-amber-400',
  active: 'text-emerald-400',
  past_due: 'text-rose-400',
  cancelled: 'text-slate-500',
};

const formatBusinessDate = (value: string) =>
  new Date(value).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

export const MyBusinessPage: React.FC = () => {
  const { data: business, isLoading } = useBusinessQuery();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex w-full items-center justify-center py-24">
        <Loader2 size={24} className="animate-spin text-slate-500" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500">
      <BusinessProfileHeader
        business={business}
        onEdit={() => setIsDrawerOpen(true)}
      />

      <div className="w-full bg-slate-900/50 border border-white/5 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-6">
          <BusinessReadView business={business} />
        </div>
      </div>

      <BusinessFormDrawer
        open={isDrawerOpen}
        business={business}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
};

const SectionGroup: React.FC<{
  title: string;
  description?: string;
  children: React.ReactNode;
}> = ({ title, description, children }) => (
  <section className="space-y-3">
    <div>
      <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
        {title}
      </h3>
      {description && (
        <p className="mt-0.5 text-[11px] text-slate-500">{description}</p>
      )}
    </div>
    {children}
  </section>
);

const ReadOnlyField: React.FC<{
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
}> = ({ icon: Icon, label, value }) => (
  <div className="rounded-xl bg-slate-900/40 px-3 py-2.5">
    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
      <Icon size={12} />
      {label}
    </div>
    <p className="mt-1 truncate text-sm text-slate-200">{value}</p>
  </div>
);

const AccountDetails: React.FC<{ business?: Business }> = ({ business }) => (
  <SectionGroup
    title="Detalles de la cuenta"
    description="Información de referencia, no editable."
  >
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <ReadOnlyField
        icon={Hash}
        label="Identificador"
        value={
          <span className="font-mono text-xs">{business?.id ?? '—'}</span>
        }
      />
      <ReadOnlyField
        icon={Calendar}
        label="Fecha de alta"
        value={
          business?.createdAt ? formatBusinessDate(business.createdAt) : '—'
        }
      />
      <ReadOnlyField
        icon={CreditCard}
        label="Estado del plan"
        value={
          business ? (
            <span
              className={`font-semibold ${PLAN_STATUS_COLORS[business.planStatus]}`}
            >
              {PLAN_STATUS_LABELS[business.planStatus]}
            </span>
          ) : (
            '—'
          )
        }
      />
    </div>
  </SectionGroup>
);

const BusinessReadView: React.FC<{ business?: Business }> = ({
  business,
}) => (
  <div className="space-y-6">
    <AccountDetails business={business} />

    <SectionGroup title="Contacto">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <ReadOnlyField
          icon={Mail}
          label="Correo"
          value={business?.email || 'Sin correo registrado'}
        />
        <ReadOnlyField
          icon={Phone}
          label="Teléfono"
          value={business?.phone || 'Sin teléfono registrado'}
        />
        <ReadOnlyField
          icon={Globe}
          label="Sitio web"
          value={business?.website || 'Sin sitio web registrado'}
        />
      </div>
    </SectionGroup>

    <SectionGroup title="Facturación">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <ReadOnlyField
          icon={MapPin}
          label="Dirección"
          value={business?.address || 'Sin dirección registrada'}
        />
        <ReadOnlyField
          icon={FileText}
          label="RUC"
          value={business?.taxId || 'Sin RUC registrado'}
        />
      </div>
    </SectionGroup>
  </div>
);
