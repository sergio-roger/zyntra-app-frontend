import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { AlertTriangle, Plus, X } from 'lucide-react';
import { WebChannelFormValues } from '@features/channels/schemas/web-channel.schema';
import { isValidDomain } from '@features/channels/utils/domain';

export const StepSecurity: React.FC = () => {
  const { watch, setValue } = useFormContext<WebChannelFormValues>();
  const allowedDomains = watch('allowedDomains');
  const [pending, setPending] = useState('');
  const [error, setError] = useState('');

  const handleAdd = () => {
    const value = pending.trim();
    if (!value) return;
    if (!isValidDomain(value)) {
      setError('Formato de dominio inválido. Ej: midominio.com');
      return;
    }
    if (allowedDomains.includes(value)) {
      setError('Ese dominio ya fue agregado.');
      return;
    }
    setValue('allowedDomains', [...allowedDomains, value], {
      shouldDirty: true,
    });
    setPending('');
    setError('');
  };

  const handleRemove = (domain: string) => {
    setValue(
      'allowedDomains',
      allowedDomains.filter((d) => d !== domain),
      { shouldDirty: true },
    );
  };

  return (
    <div className="card bg-base-100 border border-base-300 shadow-sm">
      <div className="card-body gap-4">
        <div className="alert alert-warning text-sm">
          <AlertTriangle size={16} />
          <span>
            El widget solo funcionará en los dominios que agregues aquí.
          </span>
        </div>

        <div className="form-control gap-1">
          <label className="label">
            <span className="label-text font-medium">Dominios permitidos</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              className="input input-bordered flex-1"
              placeholder="tudominio.com"
              value={pending}
              data-testid="field-domain-input"
              onChange={(e) => {
                setPending(e.target.value);
                if (error) setError('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAdd();
                }
              }}
            />
            <button
              type="button"
              className="btn btn-primary gap-1"
              onClick={handleAdd}
              data-testid="add-domain"
            >
              <Plus size={14} /> Agregar
            </button>
          </div>
          {error && (
            <span className="text-error text-xs mt-1" data-testid="domain-error">
              {error}
            </span>
          )}
        </div>

        {allowedDomains.length > 0 ? (
          <ul className="flex flex-wrap gap-2">
            {allowedDomains.map((domain) => (
              <li
                key={domain}
                data-testid={`domain-chip-${domain}`}
                className="badge badge-outline gap-1 py-3"
              >
                {domain}
                <button
                  type="button"
                  onClick={() => handleRemove(domain)}
                  aria-label={`Quitar ${domain}`}
                >
                  <X size={12} />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-base-content/50">
            Sin restricciones de dominio configuradas.
          </p>
        )}
      </div>
    </div>
  );
};
