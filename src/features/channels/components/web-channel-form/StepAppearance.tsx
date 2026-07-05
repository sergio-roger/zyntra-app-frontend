import React from 'react';
import { useFormContext } from 'react-hook-form';
import { WebChannelFormValues } from '@features/channels/schemas/web-channel.schema';
import { WidgetPreview } from './WidgetPreview';

export const StepAppearance: React.FC = () => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<WebChannelFormValues>();

  const primaryColor = watch('primaryColor');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="card-body gap-5">
          <div className="form-control gap-1">
            <label className="label">
              <span className="label-text font-medium">Color principal</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                className="w-12 h-10 rounded border border-base-300 cursor-pointer"
                value={primaryColor}
                onChange={(e) =>
                  setValue('primaryColor', e.target.value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                data-testid="field-primary-color-picker"
              />
              <input
                type="text"
                className="input input-bordered input-sm w-36"
                data-testid="field-primary-color"
                {...register('primaryColor')}
              />
            </div>
            {errors.primaryColor && (
              <span className="text-error text-xs mt-1">
                {errors.primaryColor.message}
              </span>
            )}
          </div>

          <div className="form-control gap-1">
            <label className="label">
              <span className="label-text font-medium">
                Posición del widget
              </span>
            </label>
            <select
              className="select select-bordered"
              data-testid="field-position"
              {...register('position')}
            >
              <option value="bottom-right">Inferior derecho</option>
              <option value="bottom-left">Inferior izquierdo</option>
            </select>
          </div>

          <div className="form-control gap-1">
            <label className="label">
              <span className="label-text font-medium">Tema</span>
            </label>
            <select
              className="select select-bordered"
              data-testid="field-theme"
              {...register('theme')}
            >
              <option value="auto">Automático (según el navegador)</option>
              <option value="light">Claro</option>
              <option value="dark">Oscuro</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium mb-2 text-base-content/70">
          Vista previa
        </p>
        <WidgetPreview />
      </div>
    </div>
  );
};
