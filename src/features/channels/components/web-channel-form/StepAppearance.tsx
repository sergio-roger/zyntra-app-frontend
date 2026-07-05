import React from 'react';
import { useFormContext } from 'react-hook-form';
import { LayoutTemplate, Moon, Palette } from 'lucide-react';
import { Input } from '@core/ui/Input';
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

export const StepAppearance: React.FC = () => {
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
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
      <div className="rounded-2xl border border-white/5 bg-slate-950/30 p-6 space-y-5">
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

      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
          Vista previa
        </p>
        <WidgetPreview />
      </div>
    </div>
  );
};
