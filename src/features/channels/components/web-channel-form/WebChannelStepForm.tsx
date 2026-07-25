import { useAuthStore } from '@features/auth/store/authStore';
import { channelsApi } from '@features/channels/api/channels.api';
import {
  useCreateChannelMutation,
  useUpdateChannelMutation,
} from '@features/channels/hooks/channels.queries';
import {
  WEB_CHANNEL_STEP_FIELDS,
  WebChannelFormValues,
  webChannelSchema,
} from '@features/channels/schemas/web-channel.schema';
import {
  DEFAULT_WEB_CHANNEL_FORM_VALUES,
  buildDefaultSchedule,
  useChannelsStore,
} from '@features/channels/store/useChannelsStore';
import { Channel, WebChannelBusinessHours } from '@features/channels/types/channels.types';
import { Button } from '@core/ui/Button';
import { zodResolver } from '@hookform/resolvers/zod';
import { ConfirmModal } from '@shared/components/ConfirmModal';
import { toastManager } from '@shared/components/toast/toastManager';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { StepAgent } from './StepAgent';
import { StepAvailability } from './StepAvailability';
import { StepIdentity } from './StepIdentity';
import { StepIndicator } from './StepIndicator';
import { StepSecurity } from './StepSecurity';
import { StepSummary } from './StepSummary';

interface WebChannelStepFormProps {
  mode: 'create' | 'edit';
  channel?: Channel;
  typeId?: string;
  onCancel: () => void;
  onCreated: (channel: Channel) => void;
  onUpdated: () => void;
}

const buildDefaultValues = (
  mode: 'create' | 'edit',
  channel?: Channel,
): WebChannelFormValues => {
  if (mode === 'edit' && channel) {
    const config = (channel.config ?? {}) as Record<string, unknown>;
    return {
      name: channel.name,
      greeting: typeof config.greeting === 'string' ? config.greeting : '',
      assistantName:
        typeof config.assistantName === 'string'
          ? config.assistantName
          : 'Asistente',
      primaryColor:
        typeof config.primaryColor === 'string'
          ? config.primaryColor
          : '#6366f1',
      position: config.position === 'bottom-left' ? 'bottom-left' : 'bottom-right',
      theme:
        config.theme === 'light' || config.theme === 'dark'
          ? config.theme
          : 'auto',
      availabilityMode: config.availabilityMode === 'schedule' ? 'schedule' : 'manual',
      manualStatus:
        config.manualStatus === 'busy' || config.manualStatus === 'offline'
          ? config.manualStatus
          : 'available',
      businessHours:
        config.businessHours && typeof config.businessHours === 'object'
          ? (config.businessHours as WebChannelBusinessHours)
          : {
              timezone: DEFAULT_WEB_CHANNEL_FORM_VALUES.businessHours.timezone,
              is24x7: false,
              schedule: buildDefaultSchedule(),
            },
      allowedDomains: Array.isArray(config.allowedDomains)
        ? (config.allowedDomains as string[])
        : [],
      blockedDomains: Array.isArray(config.blockedDomains)
        ? (config.blockedDomains as string[])
        : [],
      allowInsecureDomains: config.allowInsecureDomains === true,
      agentId: channel.agentId,
    };
  }
  return DEFAULT_WEB_CHANNEL_FORM_VALUES;
};

export const WebChannelStepForm: React.FC<WebChannelStepFormProps> = ({
  mode,
  channel,
  typeId,
  onCancel,
  onCreated,
  onUpdated,
}) => {
  const businessId = useAuthStore((s) => s.user?.businessId ?? '');
  const formStep = useChannelsStore((s) => s.formStep);
  const formNextStep = useChannelsStore((s) => s.formNextStep);
  const formPrevStep = useChannelsStore((s) => s.formPrevStep);
  const setFormValues = useChannelsStore((s) => s.setFormValues);
  const setInitialValues = useChannelsStore((s) => s.setInitialValues);
  const isDirty = useChannelsStore((s) => s.isDirty);
  const resetForm = useChannelsStore((s) => s.resetForm);

  const [submitError, setSubmitError] = useState('');
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  const { mutateAsync: createChannel, isPending: isCreating } =
    useCreateChannelMutation();
  const { mutateAsync: updateChannel, isPending: isUpdating } =
    useUpdateChannelMutation(channel?.id ?? '');

  const methods = useForm<WebChannelFormValues>({
    resolver: zodResolver(webChannelSchema),
    defaultValues: buildDefaultValues(mode, channel),
  });
  const { getValues, trigger, handleSubmit } = methods;

  useEffect(() => {
    setInitialValues(buildDefaultValues(mode, channel));
    return () => resetForm();
  }, [mode, channel?.id, resetForm, setInitialValues]);

  const handleNext = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const valid = await trigger(WEB_CHANNEL_STEP_FIELDS[formStep]);
    if (!valid) return;
    setFormValues(getValues());
    formNextStep();
  };

  const handleBack = () => {
    setFormValues(getValues());
    formPrevStep();
  };

  const handleCancelClick = () => {
    setFormValues(getValues());
    if (isDirty()) {
      setShowDiscardConfirm(true);
      return;
    }
    onCancel();
  };

  const applyAgentAssignment = async (
    channelId: string,
    agentId: string | null,
    previousAgentId: string | null,
  ) => {
    if (agentId === previousAgentId) return;
    try {
      if (agentId) {
        await channelsApi.assignAgent(businessId, channelId, agentId);
      } else {
        await channelsApi.unassignAgent(businessId, channelId);
      }
    } catch {
      toastManager.add({
        title: 'No se pudo asignar el agente',
        description: 'El canal se guardó correctamente, intenta asignar el agente nuevamente desde el detalle del canal.',
        type: 'warning',
      });
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError('');
    const config = {
      greeting: values.greeting || undefined,
      assistantName: values.assistantName || undefined,
      primaryColor: values.primaryColor,
      position: values.position,
      theme: values.theme,
      availabilityMode: values.availabilityMode,
      manualStatus: values.manualStatus,
      businessHours: values.businessHours,
      allowedDomains: values.allowedDomains,
      blockedDomains: values.blockedDomains,
      allowInsecureDomains: values.allowInsecureDomains,
    };

    try {
      if (mode === 'create') {
        const created = await createChannel({
          channelTypeId: typeId ?? '',
          name: values.name,
          config,
        });
        await applyAgentAssignment(created.id, values.agentId, null);
        onCreated(created);
      } else if (channel) {
        await updateChannel({ name: values.name, config });
        await applyAgentAssignment(
          channel.id,
          values.agentId,
          channel.agentId,
        );
        toastManager.add({
          title: 'Canal actualizado',
          description: `Los cambios de "${values.name}" se guardaron correctamente.`,
          type: 'success',
        });
        onUpdated();
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      setSubmitError(msg ?? 'Ocurrió un error al guardar el canal. Inténtalo de nuevo.');
    }
  });

  const isSubmitting = isCreating || isUpdating;
  const isFirstStep = formStep === 'identity';
  const isLastStep = formStep === 'summary';
  const stepMaxWidth = 'max-w-6xl mx-auto';

  return (
    <FormProvider {...methods}>
      <div className="w-full space-y-6 animate-in fade-in duration-500">
        <div>
          <button
            type="button"
            onClick={handleCancelClick}
            data-testid="cancel-web-channel-form"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft size={14} /> Cancelar
          </button>

          <h2 className="text-xl font-bold text-white tracking-tight">
            {mode === 'create'
              ? 'Crear canal web'
              : `Editar ${channel?.name ?? 'canal'}`}
          </h2>
        </div>

        <StepIndicator current={formStep} />

        <form onSubmit={onSubmit} className={`${stepMaxWidth} bg-slate-900/40 rounded-3xl border border-white/5 p-6 md:p-10 space-y-8`}>
          <div className="min-h-[420px]">
            {formStep === 'identity' && <StepIdentity />}
            {formStep === 'availability' && <StepAvailability />}
            {formStep === 'security' && <StepSecurity />}
            {formStep === 'agent' && <StepAgent />}
            {formStep === 'summary' && (
              <StepSummary
                mode={mode}
                channelId={channel?.id}
                submitError={submitError}
              />
            )}
          </div>

          <div className="flex items-center justify-between border-t border-white/5 pt-6 mt-8">
            <div>
              <button
                type="button"
                onClick={handleCancelClick}
                className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold text-slate-400 hover:text-white transition-all"
              >
                Cancelar
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleBack}
                disabled={isFirstStep}
                className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold text-slate-300 border border-white/10 hover:bg-white/5 transition-all disabled:opacity-30 disabled:pointer-events-none"
              >
                <ArrowLeft size={14} /> Atrás
              </button>

              {!isLastStep ? (
                <Button key="wizard-next-button" type="button" onClick={handleNext}>
                  Siguiente <ArrowRight size={14} />
                </Button>
              ) : (
                <Button
                  key="wizard-submit-button"
                  type="submit"
                  disabled={isSubmitting}
                  loading={isSubmitting}
                  data-testid="submit-web-channel-form"
                >
                  {isSubmitting
                    ? 'Guardando...'
                    : mode === 'create'
                      ? 'Crear canal'
                      : 'Guardar cambios'}
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>

      <ConfirmModal
        isOpen={showDiscardConfirm}
        onClose={() => setShowDiscardConfirm(false)}
        onConfirm={() => {
          resetForm();
          onCancel();
        }}
        title="Descartar cambios"
        description="Tienes cambios sin guardar en este canal. ¿Confirmas que quieres salir y descartarlos?"
        confirmText="Descartar"
        variant="danger"
      />
    </FormProvider>
  );
};
