import React from 'react';
import { useFormContext } from 'react-hook-form';
import { WebChannelFormValues } from '@features/channels/schemas/web-channel.schema';

export const StepIdentity: React.FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<WebChannelFormValues>();

  return (
    <div className="card bg-base-100 border border-base-300 shadow-sm">
      <div className="card-body gap-5">
        <div className="form-control gap-1">
          <label className="label">
            <span className="label-text font-medium">Nombre del canal *</span>
          </label>
          <input
            type="text"
            className="input input-bordered"
            placeholder="Ej. Chat Principal"
            data-testid="field-name"
            {...register('name')}
          />
          {errors.name && (
            <span className="text-error text-xs mt-1">
              {errors.name.message}
            </span>
          )}
        </div>

        <div className="form-control gap-1">
          <label className="label">
            <span className="label-text font-medium">Mensaje de bienvenida</span>
            <span className="label-text-alt text-base-content/50">
              Opcional
            </span>
          </label>
          <textarea
            className="textarea textarea-bordered"
            placeholder="¡Hola! ¿En qué podemos ayudarte hoy?"
            rows={3}
            data-testid="field-greeting"
            {...register('greeting')}
          />
        </div>

        <div className="form-control gap-1">
          <label className="label">
            <span className="label-text font-medium">
              Nombre del asistente
            </span>
          </label>
          <input
            type="text"
            className="input input-bordered"
            placeholder="Asistente"
            data-testid="field-assistant-name"
            {...register('assistantName')}
          />
        </div>
      </div>
    </div>
  );
};
