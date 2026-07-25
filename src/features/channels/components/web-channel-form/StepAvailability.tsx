import React from 'react';
import { useFormContext, useFormState, useWatch } from 'react-hook-form';
import { Clock, Globe2, Radio } from 'lucide-react';
import { Select } from '@core/ui/Select';
import {
  DAY_LABELS,
  DayKey,
  WIDGET_STATUS_LABELS,
  WIDGET_STATUSES,
  WebChannelFormValues,
  WidgetStatus,
} from '@features/channels/schemas/web-channel.schema';
import { WidgetPreview } from './WidgetPreview';

const TIMEZONE_OPTIONS = [
  { label: 'Guayaquil / Quito (GMT-5)', value: 'America/Guayaquil' },
  { label: 'Bogotá / Lima (GMT-5)', value: 'America/Bogota' },
  { label: 'Ciudad de México (GMT-6)', value: 'America/Mexico_City' },
  { label: 'Nueva York (GMT-5/-4)', value: 'America/New_York' },
  { label: 'Los Ángeles (GMT-8/-7)', value: 'America/Los_Angeles' },
  { label: 'Madrid (GMT+1/+2)', value: 'Europe/Madrid' },
  { label: 'Londres (GMT+0/+1)', value: 'Europe/London' },
  { label: 'UTC', value: 'UTC' },
];

const STATUS_DOT_CLASS: Record<WidgetStatus, string> = {
  available: 'bg-emerald-500',
  busy: 'bg-amber-500',
  offline: 'bg-slate-500',
};

const STATUS_DESCRIPTION: Record<WidgetStatus, string> = {
  available: 'El widget se muestra como "En línea" y anima a los visitantes a escribir.',
  busy: 'El widget indica que las respuestas pueden tardar más de lo usual.',
  offline: 'El widget indica que el equipo no está disponible en este momento.',
};

export const StepAvailability: React.FC = () => {
  const { control, setValue } = useFormContext<WebChannelFormValues>();
  const [availabilityMode, manualStatus, businessHours] = useWatch({
    control,
    name: ['availabilityMode', 'manualStatus', 'businessHours'],
  });

  const { errors } = useFormState({ control });
  const scheduleErrorMessage = errors.businessHours?.schedule?.message;

  const setDayField = (
    index: number,
    field: 'enabled' | 'from' | 'to',
    value: boolean | string,
  ) => {
    const next = businessHours.schedule.map((d, i) =>
      i === index ? { ...d, [field]: value } : d,
    );
    setValue('businessHours.schedule', next, { shouldDirty: true, shouldValidate: true });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
      <div className="rounded-3xl border border-white/5 bg-slate-950/30 p-6 md:p-8 space-y-6">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
            <Radio size={14} className="text-slate-500" />
            Modo de disponibilidad
          </label>
          <div className="inline-flex rounded-xl border border-white/10 bg-slate-900/60 p-1">
            {(['manual', 'schedule'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                data-testid={`availability-mode-${mode}`}
                onClick={() =>
                  setValue('availabilityMode', mode, { shouldDirty: true, shouldValidate: true })
                }
                className={`rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                  availabilityMode === mode
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {mode === 'manual' ? 'Manual' : 'Según horario de atención'}
              </button>
            ))}
          </div>
        </div>

        {availabilityMode === 'manual' ? (
          <div className="space-y-2" data-testid="availability-manual-panel">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
              Estado del widget
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {WIDGET_STATUSES.map((status) => (
                <button
                  key={status}
                  type="button"
                  data-testid={`manual-status-${status}`}
                  onClick={() =>
                    setValue('manualStatus', status, { shouldDirty: true, shouldValidate: true })
                  }
                  className={`flex flex-col items-start gap-1.5 rounded-xl border p-3 text-left transition-all ${
                    manualStatus === status
                      ? 'border-indigo-500 bg-indigo-500/10'
                      : 'border-white/10 bg-slate-900/40 hover:border-white/20'
                  }`}
                >
                  <span className="flex items-center gap-2 text-sm font-bold text-white">
                    <span className={`w-2.5 h-2.5 rounded-full ${STATUS_DOT_CLASS[status]}`} />
                    {WIDGET_STATUS_LABELS[status]}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {STATUS_DESCRIPTION[status]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-5" data-testid="availability-schedule-panel">
            <div data-testid="field-timezone">
              <Select
                label="Zona horaria"
                icon={Globe2}
                options={TIMEZONE_OPTIONS}
                value={businessHours.timezone}
                onChange={(value) =>
                  setValue('businessHours.timezone', value ?? 'UTC', { shouldDirty: true })
                }
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input
                type="checkbox"
                data-testid="field-24x7"
                checked={businessHours.is24x7}
                onChange={(e) =>
                  setValue('businessHours.is24x7', e.target.checked, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
                className="rounded border-white/20 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
              />
              El chat está disponible 24/7
            </label>

            {!businessHours.is24x7 && (
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                  <Clock size={14} className="text-slate-500" />
                  Horario de atención
                </label>
                <div className="space-y-1.5">
                  {businessHours.schedule.map((entry, index) => {
                    const rowError = errors.businessHours?.schedule?.[index]?.to?.message;
                    return (
                      <div key={entry.day}>
                        <div
                          data-testid={`schedule-row-${entry.day}`}
                          className="flex items-center gap-3 rounded-lg border border-white/5 bg-slate-900/40 px-3 py-2"
                        >
                          <label className="flex items-center gap-2 w-28 shrink-0 text-sm text-slate-300">
                            <input
                              type="checkbox"
                              checked={entry.enabled}
                              data-testid={`schedule-enabled-${entry.day}`}
                              onChange={(e) => setDayField(index, 'enabled', e.target.checked)}
                              className="rounded border-white/20 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
                            />
                            {DAY_LABELS[entry.day as DayKey]}
                          </label>
                          <input
                            type="time"
                            value={entry.from}
                            disabled={!entry.enabled}
                            data-testid={`schedule-from-${entry.day}`}
                            onChange={(e) => setDayField(index, 'from', e.target.value)}
                            className="rounded-md border border-white/10 bg-slate-950/60 px-2 py-1 text-sm text-white disabled:opacity-30"
                          />
                          <span className="text-xs text-slate-500">a</span>
                          <input
                            type="time"
                            value={entry.to}
                            disabled={!entry.enabled}
                            data-testid={`schedule-to-${entry.day}`}
                            onChange={(e) => setDayField(index, 'to', e.target.value)}
                            className="rounded-md border border-white/10 bg-slate-950/60 px-2 py-1 text-sm text-white disabled:opacity-30"
                          />
                        </div>
                        {rowError && (
                          <p className="text-[10px] font-medium text-rose-400 ml-1 mt-1">
                            {rowError}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
                {scheduleErrorMessage && (
                  <p
                    className="text-[10px] font-medium text-rose-400 ml-1"
                    data-testid="schedule-error"
                  >
                    {scheduleErrorMessage}
                  </p>
                )}
              </div>
            )}

            <p className="text-[11px] text-slate-500">
              Fuera de este horario, el widget se mostrará como "Fuera de servicio"
              automáticamente.
            </p>
          </div>
        )}
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
