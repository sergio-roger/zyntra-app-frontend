import React from 'react';
import { Plus, Trash2, Filter } from 'lucide-react';
import { useTags } from '@crm/hooks/useTags';
import { useCustomFields } from '@crm/hooks/useCustomFields';
import { useChannelsQuery } from '@features/channels/hooks/channels.queries';
import { SegmentCondition } from '@crm/types/segment-condition';
import { useLifecycleStages } from '@crm/hooks/useLifecycleStages';

interface ConditionBuilderProps {
  conditions: SegmentCondition[];
  onChange: (conditions: SegmentCondition[]) => void;
}

const selectCls =
  'w-full rounded-lg border border-slate-700/60 bg-slate-950/70 px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/20 transition-all cursor-pointer';

export const ConditionBuilder: React.FC<ConditionBuilderProps> = ({
  conditions,
  onChange,
}) => {
  const { data: tags = [] } = useTags('contact');
  const { data: customFields = [] } = useCustomFields();
  const { data: stages = [] } = useLifecycleStages();
  const { data: channels = [] } = useChannelsQuery();

  const handleAddCondition = () => {
    onChange([
      ...conditions,
      { field: 'channelId', operator: 'equals', value: '' },
    ]);
  };

  const handleRemoveCondition = (index: number) => {
    const next = [...conditions];
    next.splice(index, 1);
    onChange(next);
  };

  const handleFieldChange = (index: number, field: string) => {
    const next = [...conditions];
    next[index] = {
      field,
      operator: field === 'deal_value' ? 'greater_than' : 'equals',
      value: '',
    };
    onChange(next);
  };

  const handleOperatorChange = (
    index: number,
    operator: SegmentCondition['operator'],
  ) => {
    const next = [...conditions];
    next[index] = {
      ...next[index],
      operator,
      value:
        operator === 'is_empty' || operator === 'is_not_empty'
          ? ''
          : next[index].value,
    };
    onChange(next);
  };

  const handleValueChange = (index: number, value: any) => {
    const next = [...conditions];
    next[index] = { ...next[index], value };
    onChange(next);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Filter size={12} className="text-indigo-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Reglas de Filtrado
          </span>
          {conditions.length > 0 && (
            <span className="text-[10px] font-black bg-indigo-500/15 text-indigo-400 border border-indigo-500/20 px-1.5 py-0.5 rounded-full leading-none">
              {conditions.length}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={handleAddCondition}
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 hover:border-indigo-500/40 px-3 py-1.5 text-xs font-bold transition-all active:scale-95"
        >
          <Plus size={13} /> Añadir Regla
        </button>
      </div>

      {/* Empty state */}
      {conditions.length === 0 ? (
        <button
          type="button"
          onClick={handleAddCondition}
          className="group w-full rounded-xl border-2 border-dashed border-slate-700/50 hover:border-indigo-500/30 p-6 text-center transition-all bg-transparent hover:bg-indigo-500/5"
        >
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-slate-800 group-hover:bg-indigo-500/15 flex items-center justify-center transition-colors">
              <Plus
                size={15}
                className="text-slate-500 group-hover:text-indigo-400 transition-colors"
              />
            </div>
            <p className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors leading-relaxed">
              Sin reglas — incluye a todos los contactos.
              <br />
              <span className="text-indigo-400/70">
                Haz clic para añadir la primera.
              </span>
            </p>
          </div>
        </button>
      ) : (
        <div className="space-y-1">
          {conditions.map((cond, index) => {
            const isCustomField = cond.field.startsWith('customFields.');
            const selectedCustomField = isCustomField
              ? customFields.find(
                  (cf) => `customFields.${cf.name}` === cond.field,
                )
              : null;
            const hideValue =
              cond.operator === 'is_empty' || cond.operator === 'is_not_empty';
            const isNumeric =
              cond.field === 'deal_value' ||
              selectedCustomField?.type === 'number';

            return (
              <div key={index}>
                {/* AND connector */}
                {index > 0 && (
                  <div className="flex items-center gap-3 py-1.5 px-3">
                    <div className="flex-1 h-px bg-white/5" />
                    <span className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-600">
                      Y
                    </span>
                    <div className="flex-1 h-px bg-white/5" />
                  </div>
                )}

                {/* Condition row */}
                <div className="flex items-start gap-3 rounded-xl border border-slate-700/50 bg-slate-900/40 hover:bg-slate-900/60 p-3 transition-all group">
                  {/* Number badge */}
                  <div className="shrink-0 mt-[9px] h-5 w-5 rounded-full bg-slate-800 border border-slate-700/60 flex items-center justify-center">
                    <span className="text-[9px] font-black text-slate-500">
                      {index + 1}
                    </span>
                  </div>

                  {/* Inputs */}
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2 min-w-0">
                    {/* Field */}
                    <select
                      value={cond.field}
                      onChange={(e) => handleFieldChange(index, e.target.value)}
                      className={selectCls}
                    >
                      <optgroup label="Campos Básicos">
                        <option value="channelId">Canal</option>
                        <option value="lifecycleStageId">Ciclo de vida</option>
                        <option value="deal_value">Valor del Trato</option>
                      </optgroup>
                      <optgroup label="Etiquetas">
                        <option value="tags">Etiqueta</option>
                      </optgroup>
                      {customFields.length > 0 && (
                        <optgroup label="Campos Personalizados">
                          {customFields.map((cf) => (
                            <option
                              key={cf.id}
                              value={`customFields.${cf.name}`}
                            >
                              {cf.label}
                            </option>
                          ))}
                        </optgroup>
                      )}
                    </select>

                    {/* Operator */}
                    <select
                      value={cond.operator}
                      onChange={(e) =>
                        handleOperatorChange(
                          index,
                          e.target.value as SegmentCondition['operator'],
                        )
                      }
                      className={selectCls}
                    >
                      {isNumeric ? (
                        <>
                          <option value="equals">Es igual a</option>
                          <option value="greater_than">Es mayor que</option>
                          <option value="less_than">Es menor que</option>
                        </>
                      ) : (
                        <>
                          <option value="equals">Es igual a</option>
                          <option value="not_equals">No es igual a</option>
                          <option value="contains">Contiene</option>
                          <option value="is_empty">Está vacío</option>
                          <option value="is_not_empty">No está vacío</option>
                        </>
                      )}
                    </select>

                    {/* Value */}
                    {hideValue ? (
                      <div className="flex items-center px-3 py-2 rounded-lg border border-slate-700/30 bg-slate-950/30">
                        <span className="text-xs text-slate-600 italic">
                          sin valor requerido
                        </span>
                      </div>
                    ) : (
                      <div>
                        {cond.field === 'channelId' ? (
                          <select
                            value={cond.value}
                            onChange={(e) =>
                              handleValueChange(index, e.target.value)
                            }
                            className={selectCls}
                          >
                            <option value="">Selecciona canal</option>
                            {channels.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        ) : cond.field === 'lifecycleStageId' ? (
                          <select
                            value={cond.value}
                            onChange={(e) =>
                              handleValueChange(index, e.target.value)
                            }
                            className={selectCls}
                          >
                            <option value="">Selecciona etapa</option>
                            {stages.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.name}
                              </option>
                            ))}
                          </select>
                        ) : cond.field === 'tags' ? (
                          <select
                            value={cond.value}
                            onChange={(e) =>
                              handleValueChange(index, e.target.value)
                            }
                            className={selectCls}
                          >
                            <option value="">Selecciona etiqueta</option>
                            {tags.map((t) => (
                              <option key={t.id} value={t.name}>
                                {t.name}
                              </option>
                            ))}
                          </select>
                        ) : selectedCustomField?.type === 'select' &&
                          selectedCustomField.options ? (
                          <select
                            value={cond.value}
                            onChange={(e) =>
                              handleValueChange(index, e.target.value)
                            }
                            className={selectCls}
                          >
                            <option value="">Selecciona opción</option>
                            {selectedCustomField.options.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={isNumeric ? 'number' : 'text'}
                            value={cond.value}
                            onChange={(e) =>
                              handleValueChange(index, e.target.value)
                            }
                            placeholder="Escribe un valor…"
                            className="w-full rounded-lg border border-slate-700/60 bg-slate-950/70 px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/20 placeholder-slate-600 transition-all"
                          />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => handleRemoveCondition(index)}
                    title="Eliminar regla"
                    className="shrink-0 mt-1 p-2 rounded-lg text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/15 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
