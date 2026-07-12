import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { AlertTriangle, Ban, Globe2, Plus, ShieldAlert, X, LucideIcon } from 'lucide-react';
import { Input } from '@core/ui/Input';
import { WebChannelFormValues } from '@features/channels/schemas/web-channel.schema';
import { isValidDomain } from '@features/channels/utils/domain';

type DomainField = 'allowedDomains' | 'blockedDomains';

interface DomainListSectionProps {
  field: DomainField;
  label: string;
  placeholder: string;
  icon: LucideIcon;
  emptyLabel: string;
  otherFieldLabel: string;
  disabled: boolean;
  testIdPrefix: string;
}

const DomainListSection: React.FC<DomainListSectionProps> = ({
  field,
  label,
  placeholder,
  icon,
  emptyLabel,
  otherFieldLabel,
  disabled,
  testIdPrefix,
}) => {
  const { watch, setValue } = useFormContext<WebChannelFormValues>();
  const otherField: DomainField =
    field === 'allowedDomains' ? 'blockedDomains' : 'allowedDomains';
  const domains = watch(field);
  const otherDomains = watch(otherField);
  const [pending, setPending] = useState('');
  const [error, setError] = useState('');

  const handleAdd = () => {
    if (disabled) return;
    const value = pending.trim();
    if (!value) return;
    if (!isValidDomain(value)) {
      setError('Formato de dominio inválido. Ej: midominio.com');
      return;
    }
    if (domains.includes(value)) {
      setError('Ese dominio ya fue agregado.');
      return;
    }
    if (otherDomains.includes(value)) {
      setError(`Ese dominio ya está en "${otherFieldLabel}".`);
      return;
    }
    setValue(field, [...domains, value], { shouldDirty: true });
    setPending('');
    setError('');
  };

  const handleRemove = (domain: string) => {
    setValue(
      field,
      domains.filter((d) => d !== domain),
      { shouldDirty: true },
    );
  };

  return (
    <div
      className={`space-y-3 rounded-xl border border-white/5 bg-slate-900/30 p-4 transition-opacity ${
        disabled ? 'opacity-40 pointer-events-none' : ''
      }`}
    >
      <div className="flex items-end gap-2">
        <Input
          label={label}
          icon={icon}
          placeholder={placeholder}
          containerClassName="flex-1"
          value={pending}
          disabled={disabled}
          data-testid={`field-${testIdPrefix}-input`}
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
          disabled={disabled}
          data-testid={`add-${testIdPrefix}`}
          className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 transition-all disabled:opacity-50 disabled:pointer-events-none"
        >
          <Plus size={14} /> Agregar
        </button>
      </div>
      {error && (
        <p
          className="text-[10px] font-medium text-rose-400 -mt-1 ml-1"
          data-testid={`${testIdPrefix}-error`}
        >
          {error}
        </p>
      )}

      {domains.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {domains.map((domain) => (
            <li
              key={domain}
              data-testid={`domain-chip-${domain}`}
              className="flex items-center gap-1.5 rounded-full border border-white/10 bg-slate-900/60 px-3 py-1.5 text-xs font-medium text-slate-300"
            >
              {domain}
              <button
                type="button"
                onClick={() => handleRemove(domain)}
                disabled={disabled}
                aria-label={`Quitar ${domain}`}
                className="text-slate-500 hover:text-white transition-colors disabled:pointer-events-none"
              >
                <X size={12} />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-500">{emptyLabel}</p>
      )}
    </div>
  );
};

export const StepSecurity: React.FC = () => {
  const { watch, setValue } = useFormContext<WebChannelFormValues>();
  const allowInsecureDomains = watch('allowInsecureDomains');

  return (
    <div className="w-full space-y-5">
      <div className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
        <AlertTriangle size={16} className="shrink-0" />
        <span>
          El widget solo funcionará en los dominios permitidos y nunca en los
          dominios bloqueados.
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DomainListSection
          field="allowedDomains"
          label="Dominios permitidos"
          placeholder="tudominio.com"
          icon={Globe2}
          emptyLabel="Sin restricciones de dominio configuradas."
          otherFieldLabel="Dominios no permitidos"
          disabled={allowInsecureDomains}
          testIdPrefix="domain"
        />
        <DomainListSection
          field="blockedDomains"
          label="Dominios no permitidos"
          placeholder="dominio-bloqueado.com"
          icon={Ban}
          emptyLabel="Sin dominios bloqueados."
          otherFieldLabel="Dominios permitidos"
          disabled={allowInsecureDomains}
          testIdPrefix="blocked-domain"
        />
      </div>

      <label
        className="flex items-start gap-3 rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 cursor-pointer"
        data-testid="allow-insecure-domains-toggle"
      >
        <input
          type="checkbox"
          checked={allowInsecureDomains}
          onChange={(e) =>
            setValue('allowInsecureDomains', e.target.checked, {
              shouldDirty: true,
            })
          }
          className="mt-0.5 h-4 w-4 rounded border-white/20 bg-slate-900 accent-rose-500"
        />
        <span className="space-y-1">
          <span className="flex items-center gap-1.5 text-sm font-bold text-rose-300">
            <ShieldAlert size={14} /> Permitir dominios inseguros
          </span>
          <span className="block text-xs text-slate-400">
            Al activar esta opción, el widget funcionará desde cualquier
            dominio y las listas de dominios permitidos/no permitidos de
            arriba se ignoran por completo.
          </span>
        </span>
      </label>
    </div>
  );
};
