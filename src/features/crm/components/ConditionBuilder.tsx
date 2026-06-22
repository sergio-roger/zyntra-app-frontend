import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useTags } from '@crm/hooks/useTags';
import { useCustomFields } from '@crm/hooks/useCustomFields';
import { SegmentCondition, SOURCES, SOURCE_LABELS, STAGES, STAGE_LABELS } from '@crm/types';

interface ConditionBuilderProps {
  conditions: SegmentCondition[];
  onChange: (conditions: SegmentCondition[]) => void;
}

export const ConditionBuilder: React.FC<ConditionBuilderProps> = ({
  conditions,
  onChange,
}) => {
  const { data: tags = [] } = useTags();
  const { data: customFields = [] } = useCustomFields();

  const handleAddCondition = () => {
    const newCondition: SegmentCondition = {
      field: 'source',
      operator: 'equals',
      value: '',
    };
    onChange([...conditions, newCondition]);
  };

  const handleRemoveCondition = (index: number) => {
    const next = [...conditions];
    next.splice(index, 1);
    onChange(next);
  };

  const handleFieldChange = (index: number, field: string) => {
    const next = [...conditions];
    // Find if it is custom field or built-in field to set reasonable defaults
    let defaultOperator: SegmentCondition['operator'] = 'equals';
    const defaultValue: any = '';

    if (field === 'deal_value') {
      defaultOperator = 'greater_than';
    }

    next[index] = {
      field,
      operator: defaultOperator,
      value: defaultValue,
    };
    onChange(next);
  };

  const handleOperatorChange = (index: number, operator: SegmentCondition['operator']) => {
    const next = [...conditions];
    next[index] = {
      ...next[index],
      operator,
      value: operator === 'is_empty' || operator === 'is_not_empty' ? '' : next[index].value,
    };
    onChange(next);
  };

  const handleValueChange = (index: number, value: any) => {
    const next = [...conditions];
    next[index] = {
      ...next[index],
      value,
    };
    onChange(next);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-white/5 pb-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Reglas de Filtrado</h4>
        <button
          type="button"
          onClick={handleAddCondition}
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 px-3 py-1.5 text-xs font-bold transition-all active:scale-95"
        >
          <Plus size={14} /> Añadir Regla
        </button>
      </div>

      {conditions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center bg-slate-950/20">
          <p className="text-sm text-slate-500 font-medium">No hay reglas añadidas. Este segmento incluirá a todos los contactos.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {conditions.map((cond, index) => {
            const isCustomField = cond.field.startsWith('custom_fields.');
            const selectedCustomField = isCustomField
              ? customFields.find((cf) => `custom_fields.${cf.name}` === cond.field)
              : null;

            return (
              <div
                key={index}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 rounded-xl border border-white/10 bg-slate-900/30 p-3 relative group transition-all hover:bg-slate-900/50"
              >
                {/* Field Selection */}
                <select
                  value={cond.field}
                  onChange={(e) => handleFieldChange(index, e.target.value)}
                  className="rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-400 flex-1 min-w-[140px]"
                >
                  <optgroup label="Campos Básicos">
                    <option value="source">Origen / Fuente</option>
                    <option value="stage">Etapa Comercial</option>
                    <option value="deal_value">Valor del Trato</option>
                  </optgroup>
                  <optgroup label="Etiquetas">
                    <option value="tags">Etiqueta</option>
                  </optgroup>
                  {customFields.length > 0 && (
                    <optgroup label="Campos Personalizados">
                      {customFields.map((cf) => (
                        <option key={cf.id} value={`custom_fields.${cf.name}`}>
                          {cf.label}
                        </option>
                      ))}
                    </optgroup>
                  )}
                </select>

                {/* Operator Selection */}
                <select
                  value={cond.operator}
                  onChange={(e) => handleOperatorChange(index, e.target.value as SegmentCondition['operator'])}
                  className="rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-400 min-w-[120px]"
                >
                  {cond.field === 'deal_value' || (selectedCustomField && selectedCustomField.type === 'number') ? (
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

                {/* Value Input */}
                {cond.operator !== 'is_empty' && cond.operator !== 'is_not_empty' && (
                  <div className="flex-1 min-w-[180px]">
                    {cond.field === 'source' ? (
                      <select
                        value={cond.value}
                        onChange={(e) => handleValueChange(index, e.target.value)}
                        className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-400"
                      >
                        <option value="">Selecciona origen</option>
                        {SOURCES.map((s) => (
                          <option key={s} value={s}>
                            {SOURCE_LABELS[s]}
                          </option>
                        ))}
                      </select>
                    ) : cond.field === 'stage' ? (
                      <select
                        value={cond.value}
                        onChange={(e) => handleValueChange(index, e.target.value)}
                        className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-400"
                      >
                        <option value="">Selecciona etapa</option>
                        {STAGES.map((s) => (
                          <option key={s} value={s}>
                            {STAGE_LABELS[s]}
                          </option>
                        ))}
                      </select>
                    ) : cond.field === 'tags' ? (
                      <select
                        value={cond.value}
                        onChange={(e) => handleValueChange(index, e.target.value)}
                        className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-400"
                      >
                        <option value="">Selecciona etiqueta</option>
                        {tags.map((t) => (
                          <option key={t.id} value={t.name}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                    ) : selectedCustomField && selectedCustomField.type === 'select' && selectedCustomField.options ? (
                      <select
                        value={cond.value}
                        onChange={(e) => handleValueChange(index, e.target.value)}
                        className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-400"
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
                        type={cond.field === 'deal_value' || (selectedCustomField && selectedCustomField.type === 'number') ? 'number' : 'text'}
                        value={cond.value}
                        onChange={(e) => handleValueChange(index, e.target.value)}
                        placeholder="Escribe un valor..."
                        className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-400 placeholder-slate-600"
                      />
                    )}
                  </div>
                )}

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => handleRemoveCondition(index)}
                  className="p-2 text-slate-500 hover:text-rose-400 transition-colors self-end sm:self-center"
                  title="Eliminar regla"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
