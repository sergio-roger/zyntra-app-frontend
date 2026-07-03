import { Select } from '@core/ui/Select';
import { useCustomFields } from '@crm/hooks/useCustomFields';
import { SegmentCondition } from '@crm/types/segment-condition';
import { Plus, Trash2 } from 'lucide-react';
import React from 'react';

interface CustomFieldConditionBuilderProps {
  conditions: SegmentCondition[];
  onChange: (conditions: SegmentCondition[]) => void;
  entityType?: string;
}

export const CustomFieldConditionBuilder: React.FC<
  CustomFieldConditionBuilderProps
> = ({ conditions, onChange, entityType }) => {
  const { data: fields = [] } = useCustomFields(entityType);
  const activeFields = fields.filter((f) => f.is_active);

  if (!activeFields.length) return null;

  const add = () => {
    const first = activeFields[0];
    onChange([
      ...conditions,
      { field: `customFields.${first.name}`, operator: 'equals', value: '' },
    ]);
  };

  const remove = (i: number) => {
    const next = [...conditions];
    next.splice(i, 1);
    onChange(next);
  };

  const update = (i: number, partial: Partial<SegmentCondition>) => {
    const next = [...conditions];
    next[i] = { ...next[i], ...partial };
    onChange(next);
  };

  const fieldOptions = activeFields.map((f) => ({
    value: `customFields.${f.name}`,
    label: f.label,
  }));

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Campos personalizados
          {conditions.length > 0 && (
            <span className="ml-2 rounded-full border border-indigo-500/20 bg-indigo-500/15 px-1.5 py-0.5 text-[9px] font-black text-indigo-400">
              {conditions.length}
            </span>
          )}
        </span>
        <button
          type="button"
          onClick={add}
          className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-400 transition-colors hover:text-indigo-300"
        >
          <Plus size={11} /> Añadir condición
        </button>
      </div>

      {conditions.map((cond, i) => {
        const fieldName = cond.field.replace('customFields.', '');
        const cf = activeFields.find((f) => f.name === fieldName);
        const hideValue =
          cond.operator === 'is_empty' || cond.operator === 'is_not_empty';
        const isNumeric = cf?.type === 'number';

        const operatorOptions = isNumeric
          ? [
              { value: 'equals', label: '= igual' },
              { value: 'greater_than', label: '> mayor' },
              { value: 'less_than', label: '< menor' },
            ]
          : cf?.type === 'checkbox'
            ? [{ value: 'equals', label: 'es' }]
            : [
                { value: 'equals', label: 'igual a' },
                { value: 'not_equals', label: 'distinto de' },
                { value: 'contains', label: 'contiene' },
                { value: 'is_empty', label: 'vacío' },
                { value: 'is_not_empty', label: 'no vacío' },
              ];

        return (
          <div
            key={i}
            className="group flex items-center gap-2 rounded-lg border border-slate-700/50 bg-slate-900/40 p-2"
          >
            <div className="min-w-0 flex-1">
              <Select
                options={fieldOptions}
                value={cond.field}
                onChange={(v) =>
                  update(i, {
                    field: v ?? fieldOptions[0]?.value,
                    operator: 'equals',
                    value: '',
                  })
                }
                className="py-1.5 text-xs"
              />
            </div>

            <div className="min-w-0 flex-1">
              <Select
                options={operatorOptions}
                value={cond.operator}
                onChange={(v) =>
                  update(i, {
                    operator: (v as SegmentCondition['operator']) ?? 'equals',
                    value: '',
                  })
                }
                className="py-1.5 text-xs"
              />
            </div>

            {!hideValue &&
              (cf?.type === 'select' && cf.options ? (
                <div className="min-w-0 flex-1">
                  <Select
                    options={cf.options.map((opt) => ({
                      value: opt,
                      label: opt,
                    }))}
                    value={cond.value || null}
                    onChange={(v) => update(i, { value: v ?? '' })}
                    placeholder="Elige..."
                    className="py-1.5 text-xs"
                  />
                </div>
              ) : cf?.type === 'checkbox' ? (
                <div className="min-w-0 flex-1">
                  <Select
                    options={[
                      { value: 'true', label: 'Sí' },
                      { value: 'false', label: 'No' },
                    ]}
                    value={String(cond.value)}
                    onChange={(v) => update(i, { value: v === 'true' })}
                    className="py-1.5 text-xs"
                  />
                </div>
              ) : (
                <input
                  type={
                    isNumeric ? 'number' : cf?.type === 'date' ? 'date' : 'text'
                  }
                  value={cond.value ?? ''}
                  onChange={(e) => update(i, { value: e.target.value })}
                  placeholder="Valor..."
                  className="min-w-0 flex-1 rounded-lg border border-slate-700/60 bg-slate-950/70 px-2 py-1.5 text-xs text-slate-200 placeholder-slate-600 outline-none transition-all focus:border-indigo-400"
                />
              ))}
            {hideValue && <div className="flex-1" />}

            <button
              type="button"
              onClick={() => remove(i)}
              className="shrink-0 rounded p-1.5 text-slate-600 opacity-0 transition-all hover:bg-rose-500/10 hover:text-rose-400 group-hover:opacity-100"
            >
              <Trash2 size={13} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
