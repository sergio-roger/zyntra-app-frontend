import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { WebChannelFormValues } from '@features/channels/schemas/web-channel.schema';
import { useAiAgents } from '@features/ai-agents/hooks/useAiAgents';

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

  return (
    <div className="max-w-2xl rounded-2xl border border-white/5 bg-slate-950/30 p-6 space-y-5">
      {submitError && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
          <AlertCircle size={16} className="shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      <div>
        <SummaryRow label="Nombre">{values.name}</SummaryRow>
        <SummaryRow label="Mensaje de bienvenida">
          {values.greeting || '—'}
        </SummaryRow>
        <SummaryRow label="Nombre del asistente">
          {values.assistantName || '—'}
        </SummaryRow>
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
        <SummaryRow label="Dominios permitidos">
          {values.allowedDomains.length > 0
            ? values.allowedDomains.join(', ')
            : 'Sin restricción'}
        </SummaryRow>
        <SummaryRow label="Agente asignado">
          {assignedAgent?.name ?? 'Ninguno'}
        </SummaryRow>
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
