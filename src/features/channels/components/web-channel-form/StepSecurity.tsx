import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { AlertTriangle, Globe2, Plus, X } from 'lucide-react';
import { Input } from '@core/ui/Input';
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
    <div className="max-w-2xl rounded-2xl border border-white/5 bg-slate-950/30 p-6 space-y-5">
      <div className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
        <AlertTriangle size={16} className="shrink-0" />
        <span>
          El widget solo funcionará en los dominios que agregues aquí.
        </span>
      </div>

      <div className="flex items-end gap-2">
        <Input
          label="Dominios permitidos"
          icon={Globe2}
          placeholder="tudominio.com"
          containerClassName="flex-1"
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
          onClick={handleAdd}
          data-testid="add-domain"
          className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 transition-all"
        >
          <Plus size={14} /> Agregar
        </button>
      </div>
      {error && (
        <p
          className="text-[10px] font-medium text-rose-400 -mt-3 ml-1"
          data-testid="domain-error"
        >
          {error}
        </p>
      )}

      {allowedDomains.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {allowedDomains.map((domain) => (
            <li
              key={domain}
              data-testid={`domain-chip-${domain}`}
              className="flex items-center gap-1.5 rounded-full border border-white/10 bg-slate-900/60 px-3 py-1.5 text-xs font-medium text-slate-300"
            >
              {domain}
              <button
                type="button"
                onClick={() => handleRemove(domain)}
                aria-label={`Quitar ${domain}`}
                className="text-slate-500 hover:text-white transition-colors"
              >
                <X size={12} />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-500">
          Sin restricciones de dominio configuradas.
        </p>
      )}
    </div>
  );
};
