import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  LayoutTemplate,
  MessageSquare,
  Moon,
  Palette,
  Sparkles,
  Type,
} from 'lucide-react';
import { Input } from '@core/ui/Input';
import { Textarea } from '@core/ui/Textarea';
import { Select } from '@core/ui/Select';
import { WebChannelFormValues } from '@features/channels/schemas/web-channel.schema';
import { WidgetPreview } from './WidgetPreview';

const POSITION_OPTIONS = [
  { label: 'Inferior derecho', value: 'bottom-right' as const },
  { label: 'Inferior izquierdo', value: 'bottom-left' as const },
];

const THEME_OPTIONS = [
  { label: 'Automático (según el navegador)', value: 'auto' as const },
  { label: 'Claro', value: 'light' as const },
  { label: 'Oscuro', value: 'dark' as const },
];

export const StepIdentity: React.FC = () => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<WebChannelFormValues>();

  const primaryColor = watch('primaryColor');
  const position = watch('position');
  const theme = watch('theme');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
      <div className="rounded-3xl border border-white/5 bg-slate-950/30 p-6 md:p-8 space-y-8">
        <div className="space-y-5">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
            Identidad
          </h3>

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

        <div className="space-y-5 border-t border-white/5 pt-6">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
            Apariencia
          </h3>

          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
              <Palette size={14} className="text-slate-500" />
              Color principal
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                className="w-10 h-10 rounded-lg border border-white/10 bg-transparent cursor-pointer"
                value={primaryColor}
                onChange={(e) =>
                  setValue('primaryColor', e.target.value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                data-testid="field-primary-color-picker"
              />
              <Input
                containerClassName="flex-1"
                data-testid="field-primary-color"
                {...register('primaryColor')}
              />
            </div>
            {errors.primaryColor && (
              <p className="text-[10px] font-medium text-rose-400 ml-1">
                {errors.primaryColor.message}
              </p>
            )}
          </div>

          <div data-testid="field-position">
            <Select
              label="Posición del widget"
              icon={LayoutTemplate}
              options={POSITION_OPTIONS}
              value={position}
              onChange={(value) =>
                setValue('position', value ?? 'bottom-right', {
                  shouldDirty: true,
                })
              }
            />
          </div>

          <div data-testid="field-theme">
            <Select
              label="Tema"
              icon={Moon}
              options={THEME_OPTIONS}
              value={theme}
              onChange={(value) =>
                setValue('theme', value ?? 'auto', { shouldDirty: true })
              }
            />
          </div>
        </div>
      </div>

      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
          Vista previa
        </p>
        <WidgetPreview />
      </div>
    </div>
  );
};
