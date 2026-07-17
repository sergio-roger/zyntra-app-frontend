import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save, Sparkles, Tags, Thermometer } from 'lucide-react';
import { Input } from '@core/ui/Input';
import { Textarea } from '@core/ui/Textarea';
import { Select } from '@core/ui/Select';
import { agentIdentitySchema, AgentIdentityFormValues } from '../../schemas/agent-identity.schema';
import { useCreateAgent, useUpdateAgent } from '../../hooks/use-agents';
import { useChannelsList, useSetAgentChannel } from '../../hooks/use-agent-channel';
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
  const { data: channels = [] } = useChannelsList();
  const setChannel = useSetAgentChannel(agent?.id ?? '');

  const assignedChannel = agent ? channels.find((c) => c.agentId === agent.id) : undefined;
  const [channelId, setChannelId] = React.useState<string | null>(
    assignedChannel?.id ?? null,
  );

  useEffect(() => {
    setChannelId(assignedChannel?.id ?? null);
  }, [assignedChannel?.id]);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AgentIdentityFormValues>({
    resolver: zodResolver(agentIdentitySchema),
    values: defaultValues(agent),
  });

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
      await setChannel.mutateAsync({
        previousChannelId: assignedChannel?.id ?? null,
        nextChannelId: channelId,
      });
    } else {
      const created = await createAgent.mutateAsync(payload);
      if (channelId) {
        await setChannel.mutateAsync({ previousChannelId: null, nextChannelId: channelId });
      }
      onCreated(created);
    }
  };

  const isSaving = isSubmitting || createAgent.isPending || updateAgent.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-2xl">
      <Input
        label="Nombre del agente"
        icon={Sparkles}
        error={errors.name?.message}
        {...register('name')}
      />

      <Textarea
        label="Prompt del sistema"
        rows={8}
        placeholder="Sos un asistente de ventas amable que responde en base a la base de conocimiento..."
        error={errors.systemPrompt?.message}
        {...register('systemPrompt')}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Modelo"
          placeholder="openai/gpt-oss-20b:free"
          error={errors.model?.message}
          {...register('model')}
        />
        <Input
          label="Máx. tokens de respuesta"
          type="number"
          min={1}
          max={32000}
          error={errors.maxTokens?.message}
          {...register('maxTokens', { valueAsNumber: true })}
        />
      </div>

      <Input
        label="Temperatura"
        icon={Thermometer}
        type="number"
        step={0.1}
        min={0}
        max={1}
        error={errors.temperature?.message}
        {...register('temperature', { valueAsNumber: true })}
      />

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

      <Select
        label="Canal asignado"
        options={channels.map((c) => ({ value: c.id, label: c.name }))}
        value={channelId}
        onChange={setChannelId}
        clearable
        clearLabel="Sin asignar"
        placeholder="Elegí un canal..."
      />

      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" className="toggle toggle-primary" {...register('isActive')} />
        <span className="text-sm text-slate-300">Agente activo</span>
      </label>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold bg-primary text-white shadow-lg shadow-primary/20 hover:opacity-90 transition-all disabled:opacity-50"
        >
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {agent ? 'Guardar cambios' : 'Crear agente'}
        </button>
      </div>
    </form>
  );
};
