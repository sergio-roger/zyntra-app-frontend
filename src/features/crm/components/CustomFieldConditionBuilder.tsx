import { useCustomFields } from '@crm/hooks/useCustomFields';
import { SegmentCondition } from '@crm/types/segment-condition';
import { Plus, Trash2 } from 'lucide-react';
import React from 'react';

interface CustomFieldConditionBuilderProps {
  conditions: SegmentCondition[];
  onChange: (conditions: SegmentCondition[]) => void;
}

const selectCls =
  'flex-1 min-w-0 rounded-lg border border-slate-700/60 bg-slate-950/70 px-2 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/20 transition-all cursor-pointer';

export const CustomFieldConditionBuilder: React.FC<CustomFieldConditionBuilderProps> = ({
  conditions,
  onChange,
}) => {
  const { data: fields = [] } = useCustomFields();
  const activeFields = fields.filter((f) => f.is_active);

  if (!activeFields.length) return null;

  const add = () => {
    const first = activeFields[0];
    onChange([
      ...conditions,
      { field: `custom_fields.${first.name}`, operator: 'equals', value: '' },
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

  return (
    <div className="w-full space-y-2 border-t border-white/5 pt-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Campos personalizados
          {conditions.length > 0 && (
            <span className="ml-2 text-[9px] font-black bg-indigo-500/15 text-indigo-400 border border-indigo-500/20 px-1.5 py-0.5 rounded-full">
              {conditions.length}
            </span>
          )}
        </span>
        <button
          type="button"
          onClick={add}
          className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          <Plus size={11} /> Añadir condición
        </button>
      </div>

      {conditions.map((cond, i) => {
        const fieldName = cond.field.replace('custom_fields.', '');
        const cf = activeFields.find((f) => f.name === fieldName);
        const hideValue = cond.operator === 'is_empty' || cond.operator === 'is_not_empty';
        const isNumeric = cf?.type === 'number';

        return (
          <div
            key={i}
            className="flex items-center gap-2 rounded-lg border border-slate-700/50 bg-slate-900/40 p-2 group"
          >
            <select
              value={cond.field}
              onChange={(e) => update(i, { field: e.target.value, operator: 'equals', value: '' })}
              className={selectCls}
            >
              {activeFields.map((f) => (
                <option key={f.id} value={`custom_fields.${f.name}`}>
                  {f.label}
                </option>
              ))}
            </select>

            <select
              value={cond.operator}
              onChange={(e) =>
                update(i, { operator: e.target.value as SegmentCondition['operator'], value: '' })
              }
              className={selectCls}
            >
              {isNumeric ? (
                <>
                  <option value="equals">= igual</option>
                  <option value="greater_than">&gt; mayor</option>
                  <option value="less_than">&lt; menor</option>
                </>
              ) : cf?.type === 'checkbox' ? (
                <option value="equals">es</option>
              ) : (
                <>
                  <option value="equals">igual a</option>
                  <option value="not_equals">distinto de</option>
                  <option value="contains">contiene</option>
                  <option value="is_empty">vacío</option>
                  <option value="is_not_empty">no vacío</option>
                </>
              )}
            </select>

            {!hideValue && (
              cf?.type === 'select' && cf.options ? (
                <select
                  value={cond.value}
                  onChange={(e) => update(i, { value: e.target.value })}
                  className={selectCls}
                >
                  <option value="">Elige...</option>
                  {cf.options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : cf?.type === 'checkbox' ? (
                <select
                  value={String(cond.value)}
                  onChange={(e) => update(i, { value: e.target.value === 'true' })}
                  className={selectCls}
                >
                  <option value="true">Sí</option>
                  <option value="false">No</option>
                </select>
              ) : (
                <input
                  type={isNumeric ? 'number' : cf?.type === 'date' ? 'date' : 'text'}
                  value={cond.value ?? ''}
                  onChange={(e) => update(i, { value: e.target.value })}
                  placeholder="Valor..."
                  className="flex-1 min-w-0 rounded-lg border border-slate-700/60 bg-slate-950/70 px-2 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-400 placeholder-slate-600 transition-all"
                />
              )
            )}
            {hideValue && <div className="flex-1" />}

            <button
              type="button"
              onClick={() => remove(i)}
              className="shrink-0 p-1.5 rounded text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={13} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
