import { Accordion } from '@core/ui/Accordion';
import { Button } from '@core/ui/Button';
import { Input } from '@core/ui/Input';
import { Select } from '@core/ui/Select';
import { useCustomFields } from '@crm/hooks/useCustomFields';
import { CustomFieldType } from '@crm/types/custom-field';
import { Check, Settings2, SlidersHorizontal, X } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { FormField } from '../types/forms';

interface FormFieldSidebarProps {
  open: boolean;
  field: FormField | null;
  onClose: () => void;
  onSave: (field: FormField) => void;
}

const FIELD_TYPE_LABELS: Record<CustomFieldType, string> = {
  text: 'Texto corto',
  number: 'Número',
  date: 'Fecha',
  select: 'Selección única',
  checkbox: 'Casilla de verificación',
  url: 'Enlace web',
};

const slugifyKey = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/(^_|_$)/g, '');

const NO_MAPPING = '';

export const FormFieldSidebar: React.FC<FormFieldSidebarProps> = ({
  open,
  field,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    label: '',
    fieldKey: '',
    type: 'text' as CustomFieldType,
    options: [] as string[],
    required: false,
    placeholder: '',
    mapsTo: NO_MAPPING,
    validation: {
      minLength: undefined as number | undefined,
      maxLength: undefined as number | undefined,
      min: undefined as number | undefined,
      max: undefined as number | undefined,
      regex: '' as string,
    },
  });
  const [newOption, setNewOption] = useState('');
  const [fieldKeyTouched, setFieldKeyTouched] = useState(!!field);

  const { data: contactCustomFields = [] } = useCustomFields('contact');
  const { data: companyCustomFields = [] } = useCustomFields('company');

  const mapsToOptions = useMemo(() => {
    const activeContactFields = contactCustomFields.filter((f) => f.isActive);
    const activeCompanyFields = companyCustomFields.filter((f) => f.isActive);
    return [
      { value: NO_MAPPING, label: 'Sin mapeo (dato libre)' },
      { value: 'contact.email', label: 'Contacto → Email' },
      { value: 'contact.name', label: 'Contacto → Nombre' },
      { value: 'contact.phone', label: 'Contacto → Teléfono' },
      { value: 'contact.jobTitle', label: 'Contacto → Cargo' },
      ...activeContactFields.map((f) => ({
        value: `contact.custom.${f.name}`,
        label: `Contacto → ${f.label}`,
      })),
      { value: 'company.name', label: 'Empresa → Nombre' },
      { value: 'company.website', label: 'Empresa → Sitio web' },
      ...activeCompanyFields.map((f) => ({
        value: `company.custom.${f.name}`,
        label: `Empresa → ${f.label}`,
      })),
      { value: 'deal.value', label: 'Negocio → Valor' },
    ];
  }, [contactCustomFields, companyCustomFields]);

  useEffect(() => {
    if (field) {
      setFormData({
        label: field.label,
        fieldKey: field.fieldKey,
        type: field.type,
        options: field.options ?? [],
        required: field.required,
        placeholder: field.placeholder ?? '',
        mapsTo: field.mapsTo ?? NO_MAPPING,
        validation: {
          minLength: field.validation?.minLength,
          maxLength: field.validation?.maxLength,
          min: field.validation?.min,
          max: field.validation?.max,
          regex: field.validation?.regex ?? '',
        },
      });
      setFieldKeyTouched(true);
    } else {
      setFormData({
        label: '',
        fieldKey: '',
        type: 'text',
        options: [],
        required: false,
        placeholder: '',
        mapsTo: NO_MAPPING,
        validation: {
          minLength: undefined,
          maxLength: undefined,
          min: undefined,
          max: undefined,
          regex: '',
        },
      });
      setFieldKeyTouched(false);
    }
  }, [field, open]);

  const handleAddOption = () => {
    if (newOption.trim() && !formData.options.includes(newOption.trim())) {
      setFormData({ ...formData, options: [...formData.options, newOption.trim()] });
      setNewOption('');
    }
  };

  const handleRemoveOption = (opt: string) => {
    setFormData({
      ...formData,
      options: formData.options.filter((o) => o !== opt),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = {
      minLength: formData.validation.minLength,
      maxLength: formData.validation.maxLength,
      min: formData.validation.min,
      max: formData.validation.max,
      regex: formData.validation.regex || undefined,
    };
    const hasValidation = Object.values(validation).some((v) => v !== undefined);

    onSave({
      ...(field?.id ? { id: field.id } : {}),
      label: formData.label,
      fieldKey: formData.fieldKey,
      type: formData.type,
      options: formData.type === 'select' ? formData.options : null,
      required: formData.required,
      placeholder: formData.placeholder || null,
      mapsTo: formData.mapsTo || null,
      validation: hasValidation ? validation : null,
    });
    onClose();
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 !mt-0 backdrop-blur-sm z-[60] transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <div
        className={`fixed inset-y-0 right-0 w-full !mt-0 max-w-md bg-slate-900 border-l border-white/10 z-[70] shadow-2xl transform transition-transform duration-300 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-white/5 bg-slate-900/50 backdrop-blur-md">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Settings2 size={20} className="text-indigo-400" />
                {field ? 'Editar Campo' : 'Nuevo Campo'}
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                {field
                  ? 'Modifica la configuración del campo'
                  : 'Agregá un campo a este formulario'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          <form
            id="form-field-form"
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto p-6 space-y-6"
          >
            <Input
              label="Etiqueta visible"
              required
              value={formData.label}
              onChange={(e) => {
                const label = e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  label,
                  fieldKey: fieldKeyTouched ? prev.fieldKey : slugifyKey(label),
                }));
              }}
              placeholder="Ej: Nombre completo"
            />

            <Input
              label="Field Key (short-code)"
              required
              pattern="[a-z][a-z0-9_]*"
              value={formData.fieldKey}
              onChange={(e) => {
                setFieldKeyTouched(true);
                setFormData({
                  ...formData,
                  fieldKey: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_'),
                });
              }}
              placeholder="ej: nombre_completo"
              className="font-mono"
            />

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Tipo de Dato
              </label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(FIELD_TYPE_LABELS).map(([val, label]) => {
                  const isSelected = formData.type === val;
                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, type: val as CustomFieldType })
                      }
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${isSelected ? 'bg-indigo-600/10 border-indigo-500 text-white' : 'bg-slate-800/40 border-white/5 text-slate-400 hover:border-white/10'}`}
                    >
                      <span className="text-xs font-medium">{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {formData.type === 'select' && (
              <div className="space-y-3 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Opciones del Menú
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                    placeholder="Nueva opción..."
                    className="flex-1 px-4 py-2 rounded-xl bg-slate-800 border border-white/5 text-sm text-white focus:outline-none"
                    onKeyDown={(e) =>
                      e.key === 'Enter' && (e.preventDefault(), handleAddOption())
                    }
                  />
                  <button
                    type="button"
                    onClick={handleAddOption}
                    className="px-4 rounded-xl bg-slate-700 text-white hover:bg-slate-600 transition-colors"
                  >
                    Añadir
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.options.map((opt) => (
                    <span
                      key={opt}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-medium border border-indigo-500/20"
                    >
                      {opt}
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(opt)}
                        className="hover:text-white"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <Input
              label="Placeholder (opcional)"
              value={formData.placeholder}
              onChange={(e) => setFormData({ ...formData, placeholder: e.target.value })}
              placeholder="Texto de ayuda dentro del campo"
            />

            <Select
              label="Mapea a"
              options={mapsToOptions}
              value={formData.mapsTo}
              onChange={(value) => setFormData({ ...formData, mapsTo: value ?? NO_MAPPING })}
            />

            <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-800/30 border border-white/5">
              <input
                type="checkbox"
                id="field_required"
                checked={formData.required}
                onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
                className="h-5 w-5 rounded border-white/10 bg-slate-800 text-indigo-600 focus:ring-indigo-500/40"
              />
              <div>
                <label
                  htmlFor="field_required"
                  className="text-sm font-bold text-slate-200 cursor-pointer"
                >
                  Campo Obligatorio
                </label>
                <p className="text-[10px] text-slate-500">
                  Se exigirá completar este campo antes de enviar el formulario.
                </p>
              </div>
            </div>

            <Accordion
              title="Validación avanzada"
              icon={SlidersHorizontal}
              containerClassName="border-white/5"
            >
              <div className="grid grid-cols-2 gap-3">
                {(formData.type === 'text' || formData.type === 'url') && (
                  <>
                    <Input
                      label="Mín. caracteres"
                      type="number"
                      value={formData.validation.minLength ?? ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          validation: {
                            ...formData.validation,
                            minLength: e.target.value ? Number(e.target.value) : undefined,
                          },
                        })
                      }
                    />
                    <Input
                      label="Máx. caracteres"
                      type="number"
                      value={formData.validation.maxLength ?? ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          validation: {
                            ...formData.validation,
                            maxLength: e.target.value ? Number(e.target.value) : undefined,
                          },
                        })
                      }
                    />
                  </>
                )}
                {formData.type === 'number' && (
                  <>
                    <Input
                      label="Valor mínimo"
                      type="number"
                      value={formData.validation.min ?? ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          validation: {
                            ...formData.validation,
                            min: e.target.value ? Number(e.target.value) : undefined,
                          },
                        })
                      }
                    />
                    <Input
                      label="Valor máximo"
                      type="number"
                      value={formData.validation.max ?? ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          validation: {
                            ...formData.validation,
                            max: e.target.value ? Number(e.target.value) : undefined,
                          },
                        })
                      }
                    />
                  </>
                )}
                <Input
                  label="Expresión regular (opcional)"
                  containerClassName="col-span-2"
                  className="font-mono"
                  value={formData.validation.regex}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      validation: { ...formData.validation, regex: e.target.value },
                    })
                  }
                  placeholder="^[0-9]{5}$"
                />
              </div>
            </Accordion>
          </form>

          <div className="p-6 border-t border-white/5 bg-slate-900/50 backdrop-blur-md">
            <div className="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                form="form-field-form"
                type="submit"
                icon={Check}
                className="flex-[2]"
              >
                {field ? 'Guardar Cambios' : 'Agregar Campo'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
