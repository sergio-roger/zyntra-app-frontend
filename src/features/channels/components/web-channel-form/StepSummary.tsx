import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  Bot,
  Clock,
  MessageSquare,
  Palette,
  ShieldAlert,
} from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import {
  DAY_LABELS,
  DayKey,
  WIDGET_STATUS_LABELS,
  WebChannelFormValues,
} from '@features/channels/schemas/web-channel.schema';
import { useAiAgents } from '@features/ai-agents/hooks/useAiAgents';
import { getEffectiveWidgetStatus } from '@features/channels/utils/availability';

const POSITION_LABELS: Record<WebChannelFormValues['position'], string> = {
  'bottom-right': 'Inferior derecho',
  'bottom-left': 'Inferior izquierdo',
};

const THEME_LABELS: Record<WebChannelFormValues['theme'], string> = {
  auto: 'Automático',
  light: 'Claro',
  dark: 'Oscuro',
};

interface SummaryRowProps {
  label: string;
  children: React.ReactNode;
}

const SummaryRow: React.FC<SummaryRowProps> = ({ label, children }) => (
  <div className="flex items-start justify-between gap-4 py-2.5 border-b border-white/5 last:border-b-0">
    <span className="text-sm text-slate-400">{label}</span>
    <span className="text-sm font-medium text-white text-right">
      {children}
    </span>
  </div>
);

interface SummaryCardProps {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ icon: Icon, title, children }) => (
  <div className="rounded-xl border border-white/5 bg-slate-900/40 p-5">
    <h3 className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
      <Icon size={14} className="text-slate-500" /> {title}
    </h3>
    <div>{children}</div>
  </div>
);

interface StepSummaryProps {
  mode: 'create' | 'edit';
  channelId?: string;
  submitError: string;
}

export const StepSummary: React.FC<StepSummaryProps> = ({
  mode,
  channelId,
  submitError,
}) => {
  const { getValues } = useFormContext<WebChannelFormValues>();
  const values = getValues();
  const { data: agents = [] } = useAiAgents();
  const assignedAgent = agents.find((a) => a.id === values.agentId);
  const effectiveStatus = getEffectiveWidgetStatus(values);
  const activeDays = values.businessHours.schedule.filter((d) => d.enabled);

  return (
    <div className="w-full space-y-6">
      {submitError && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
          <AlertCircle size={16} className="shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SummaryCard icon={MessageSquare} title="Identidad">
          <SummaryRow label="Nombre">{values.name}</SummaryRow>
          <SummaryRow label="Mensaje de bienvenida">
            {values.greeting || '—'}
          </SummaryRow>
          <SummaryRow label="Nombre del asistente">
            {values.assistantName || '—'}
          </SummaryRow>
        </SummaryCard>

        <SummaryCard icon={Palette} title="Apariencia">
          <SummaryRow label="Color principal">
            <span className="inline-flex items-center gap-2">
              <span
                className="w-4 h-4 rounded-full border border-white/10"
                style={{ backgroundColor: values.primaryColor }}
              />
              {values.primaryColor}
            </span>
          </SummaryRow>
          <SummaryRow label="Posición">
            {POSITION_LABELS[values.position]}
          </SummaryRow>
          <SummaryRow label="Tema">{THEME_LABELS[values.theme]}</SummaryRow>
        </SummaryCard>

        <SummaryCard icon={Clock} title="Disponibilidad">
          <SummaryRow label="Modo">
            {values.availabilityMode === 'manual'
              ? `Manual · ${WIDGET_STATUS_LABELS[values.manualStatus]}`
              : `Según horario (ahora: ${WIDGET_STATUS_LABELS[effectiveStatus]})`}
          </SummaryRow>
          {values.availabilityMode === 'schedule' && (
            <SummaryRow label="Horario de atención">
              {values.businessHours.is24x7
                ? '24/7'
                : activeDays.length > 0
                  ? activeDays
                      .map((d) => `${DAY_LABELS[d.day as DayKey]} ${d.from}-${d.to}`)
                      .join(', ')
                  : 'Sin días configurados'}
            </SummaryRow>
          )}
        </SummaryCard>

        <SummaryCard icon={ShieldAlert} title="Seguridad">
          <SummaryRow label="Dominios inseguros permitidos">
            {values.allowInsecureDomains ? 'Sí (sin restricción de dominio)' : 'No'}
          </SummaryRow>
          {!values.allowInsecureDomains && (
            <>
              <SummaryRow label="Dominios permitidos">
                {values.allowedDomains.length > 0
                  ? values.allowedDomains.join(', ')
                  : 'Sin restricción'}
              </SummaryRow>
              <SummaryRow label="Dominios no permitidos">
                {values.blockedDomains.length > 0
                  ? values.blockedDomains.join(', ')
                  : 'Ninguno'}
              </SummaryRow>
            </>
          )}
        </SummaryCard>

        <SummaryCard icon={Bot} title="Agente de IA">
          <SummaryRow label="Agente asignado">
            {assignedAgent?.name ?? 'Ninguno'}
          </SummaryRow>
        </SummaryCard>
      </div>

      {mode === 'edit' && channelId && (
        <Link
          to={`/settings/channels/${channelId}`}
          className="inline-block text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          Más opciones (activar/desactivar, eliminar)
        </Link>
      )}
    </div>
  );
};
