import React from 'react';
import { useForm, useWatch, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, Sparkles, Tags } from 'lucide-react';
import { Button } from '@core/ui/Button';
import { Input } from '@core/ui/Input';
import { Textarea } from '@core/ui/Textarea';
import { Select } from '@core/ui/Select';
import { Slider } from '@core/ui/Slider';
import { agentIdentitySchema, AgentIdentityFormValues } from '../../schemas/agent-identity.schema';
import { useCreateAgent, useUpdateAgent } from '../../hooks/use-agents';
import { Agent, ChatbotLocale, ChatbotTone } from '../../types/automations';

const TONE_OPTIONS = [
  { value: ChatbotTone.FRIENDLY, label: 'Amigable' },
  { value: ChatbotTone.FORMAL, label: 'Formal' },
  { value: ChatbotTone.CASUAL, label: 'Casual' },
  { value: ChatbotTone.PROFESSIONAL, label: 'Profesional' },
  { value: ChatbotTone.ENTHUSIASTIC, label: 'Entusiasta' },
];

const LOCALE_OPTIONS = [
  { value: ChatbotLocale.ES, label: 'Español' },
  { value: ChatbotLocale.EN, label: 'Inglés' },
  { value: ChatbotLocale.PT, label: 'Portugués' },
];

interface IdentityTabProps {
  agent: Agent | undefined;
  onCreated: (agent: Agent) => void;
}

const defaultValues = (agent: Agent | undefined): AgentIdentityFormValues => ({
  name: agent?.name ?? '',
  systemPrompt: agent?.systemPrompt ?? '',
  model: agent?.model ?? 'openai/gpt-oss-20b:free',
  temperature: agent?.temperature ?? 0.7,
  maxTokens: agent?.maxTokens ?? 1024,
  tone: agent?.tone ?? null,
  locale: agent?.locale ?? null,
  isActive: agent?.isActive ?? true,
});

export const IdentityTab: React.FC<IdentityTabProps> = ({ agent, onCreated }) => {
  const createAgent = useCreateAgent();
  const updateAgent = useUpdateAgent(agent?.id ?? '');

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AgentIdentityFormValues>({
    resolver: zodResolver(agentIdentitySchema),
    values: defaultValues(agent),
  });

  const maxTokens = useWatch({ control, name: 'maxTokens' });
  const temperature = useWatch({ control, name: 'temperature' });

  const onSubmit = async (data: AgentIdentityFormValues) => {
    const payload = {
      name: data.name,
      systemPrompt: data.systemPrompt,
      model: data.model,
      temperature: data.temperature,
      maxTokens: data.maxTokens,
      tone: data.tone ?? undefined,
      locale: data.locale ?? undefined,
      isActive: data.isActive,
    };

    if (agent) {
      await updateAgent.mutateAsync(payload);
    } else {
      const created = await createAgent.mutateAsync(payload);
      onCreated(created);
    }
  };

  const isSaving = isSubmitting || createAgent.isPending || updateAgent.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Nombre del agente"
          icon={Sparkles}
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          label="Modelo"
          placeholder="openai/gpt-oss-20b:free"
          error={errors.model?.message}
          {...register('model')}
        />
      </div>

      <Textarea
        label="Prompt del sistema"
        rows={8}
        placeholder="Sos un asistente de ventas amable que responde en base a la base de conocimiento..."
        error={errors.systemPrompt?.message}
        {...register('systemPrompt')}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Slider
          label="Máx. tokens de respuesta"
          min={1}
          max={1024}
          step={1}
          value={maxTokens}
          error={errors.maxTokens?.message}
          {...register('maxTokens', { valueAsNumber: true })}
        />
        <Slider
          label="Temperatura"
          min={0}
          max={1}
          step={0.1}
          value={temperature}
          formatValue={(v) => v.toFixed(1)}
          error={errors.temperature?.message}
          {...register('temperature', { valueAsNumber: true })}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Controller
          control={control}
          name="tone"
          render={({ field }) => (
            <Select
              label="Tono"
              icon={Tags}
              options={TONE_OPTIONS}
              value={field.value}
              onChange={field.onChange}
              clearable
              clearLabel="Sin definir"
            />
          )}
        />
        <Controller
          control={control}
          name="locale"
          render={({ field }) => (
            <Select
              label="Idioma"
              options={LOCALE_OPTIONS}
              value={field.value}
              onChange={field.onChange}
              clearable
              clearLabel="Sin definir"
            />
          )}
        />
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" className="toggle toggle-primary" {...register('isActive')} />
        <span className="text-sm text-slate-300">Agente activo</span>
      </label>

      <div className="flex justify-end pt-2">
        <Button type="submit" loading={isSaving} icon={Save}>
          {agent ? 'Guardar cambios' : 'Crear agente'}
        </Button>
      </div>
    </form>
  );
};
