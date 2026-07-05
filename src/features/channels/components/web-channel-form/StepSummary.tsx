import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Loader2 } from 'lucide-react';
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
  <div className="flex items-start justify-between gap-4 py-2 border-b border-base-200 last:border-b-0">
    <span className="text-sm text-base-content/60">{label}</span>
    <span className="text-sm font-medium text-right">{children}</span>
  </div>
);

interface StepSummaryProps {
  mode: 'create' | 'edit';
  channelId?: string;
  isSubmitting: boolean;
  submitError: string;
}

export const StepSummary: React.FC<StepSummaryProps> = ({
  mode,
  channelId,
  isSubmitting,
  submitError,
}) => {
  const { getValues } = useFormContext<WebChannelFormValues>();
  const values = getValues();
  const { data: agents = [] } = useAiAgents();
  const assignedAgent = agents.find((a) => a.id === values.agentId);

  return (
    <div className="card bg-base-100 border border-base-300 shadow-sm">
      <div className="card-body gap-4">
        {submitError && (
          <div className="alert alert-error text-sm">
            <AlertCircle size={16} />
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
                className="w-4 h-4 rounded-full border border-base-300"
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
            className="link link-primary text-xs w-fit"
          >
            Más opciones (activar/desactivar, eliminar)
          </Link>
        )}

        <div className="card-actions justify-end">
          <button
            type="submit"
            className="btn btn-primary gap-1"
            disabled={isSubmitting}
            data-testid="submit-web-channel-form"
          >
            {isSubmitting && <Loader2 size={14} className="animate-spin" />}
            {isSubmitting
              ? 'Guardando...'
              : mode === 'create'
                ? 'Crear canal'
                : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  );
};
