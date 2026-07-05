import React from 'react';
import { useFormContext } from 'react-hook-form';
import { MessageSquare, Sparkles, Type } from 'lucide-react';
import { Input } from '@core/ui/Input';
import { Textarea } from '@core/ui/Textarea';
import { WebChannelFormValues } from '@features/channels/schemas/web-channel.schema';

export const StepIdentity: React.FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<WebChannelFormValues>();

  return (
    <div className="max-w-2xl rounded-2xl border border-white/5 bg-slate-950/30 p-6 space-y-5">
      <Input
        label="Nombre del canal *"
        icon={Type}
        placeholder="Ej. Chat Principal"
        error={errors.name?.message}
        data-testid="field-name"
        {...register('name')}
      />

      <Textarea
        label="Mensaje de bienvenida (opcional)"
        icon={MessageSquare}
        rows={3}
        placeholder="¡Hola! ¿En qué podemos ayudarte hoy?"
        data-testid="field-greeting"
        {...register('greeting')}
      />

      <Input
        label="Nombre del asistente"
        icon={Sparkles}
        placeholder="Asistente"
        data-testid="field-assistant-name"
        {...register('assistantName')}
      />
    </div>
  );
};
