import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@features/auth/store/authStore';
import { ConfirmModal } from '@shared/components/ConfirmModal';
import { toastManager } from '@shared/components/toast/toastManager';
import { channelsApi } from '@features/channels/api/channels.api';
import { Channel } from '@features/channels/types/channels.types';
import {
  webChannelSchema,
  WebChannelFormValues,
  WEB_CHANNEL_STEP_FIELDS,
} from '@features/channels/schemas/web-channel.schema';
import {
  useChannelsStore,
  DEFAULT_WEB_CHANNEL_FORM_VALUES,
} from '@features/channels/store/useChannelsStore';
import {
  useCreateChannelMutation,
  useUpdateChannelMutation,
} from '@features/channels/hooks/channels.queries';
import { StepIndicator } from './StepIndicator';
import { StepIdentity } from './StepIdentity';
import { StepAppearance } from './StepAppearance';
import { StepSecurity } from './StepSecurity';
import { StepAgent } from './StepAgent';
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
      allowedDomains: Array.isArray(config.allowedDomains)
        ? (config.allowedDomains as string[])
        : [],
      agentId: channel.agent_id,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, channel?.id]);

  const handleNext = async () => {
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
      allowedDomains: values.allowedDomains,
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
          channel.agent_id,
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

  return (
    <FormProvider {...methods}>
      <div className="max-w-2xl mx-auto">
        <button
          type="button"
          className="btn btn-ghost btn-sm gap-1 mb-6"
          onClick={handleCancelClick}
          data-testid="cancel-web-channel-form"
        >
          <ArrowLeft size={14} /> Cancelar
        </button>

        <h1 className="text-xl font-bold mb-2">
          {mode === 'create' ? 'Crear canal web' : `Editar ${channel?.name ?? 'canal'}`}
        </h1>
        <StepIndicator current={formStep} />

        <form onSubmit={onSubmit}>
          {formStep === 'identity' && <StepIdentity />}
          {formStep === 'appearance' && <StepAppearance />}
          {formStep === 'security' && <StepSecurity />}
          {formStep === 'agent' && <StepAgent />}
          {formStep === 'summary' && (
            <StepSummary
              mode={mode}
              channelId={channel?.id}
              isSubmitting={isSubmitting}
              submitError={submitError}
            />
          )}

          {!isLastStep && (
            <div className="flex justify-between mt-4">
              <button
                type="button"
                className="btn btn-ghost gap-1"
                onClick={handleBack}
                disabled={isFirstStep}
              >
                <ArrowLeft size={14} /> Atrás
              </button>
              <button
                type="button"
                className="btn btn-primary gap-1"
                onClick={handleNext}
              >
                Siguiente <ArrowRight size={14} />
              </button>
            </div>
          )}

          {isLastStep && (
            <div className="flex justify-start mt-4">
              <button
                type="button"
                className="btn btn-ghost gap-1"
                onClick={handleBack}
              >
                <ArrowLeft size={14} /> Atrás
              </button>
            </div>
          )}
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
