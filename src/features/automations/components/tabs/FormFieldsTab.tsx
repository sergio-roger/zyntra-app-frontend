import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  GripVertical,
  Loader2,
  Plus,
  Save,
  Settings2,
  Trash2,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { FormFieldSidebar } from '../FormFieldSidebar';
import { useReplaceFormFields } from '../../hooks/use-forms';
import { FormField, FormTemplateWithFields } from '../../types/forms';

interface FormFieldsTabProps {
  template: FormTemplateWithFields;
}

interface SortableFieldRowProps {
  field: FormField;
  onEdit: () => void;
  onRemove: () => void;
}

const SortableFieldRow: React.FC<SortableFieldRowProps> = ({
  field,
  onEdit,
  onRemove,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: field.fieldKey });

  const style = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-3 bg-slate-800/40 border border-white/[0.05] rounded-xl transition-all ${
        isDragging
          ? 'border-indigo-500 bg-slate-800/80 shadow-lg shadow-indigo-500/10 scale-[1.02]'
          : 'hover:bg-slate-800/60'
      }`}
    >
      <div
        className="cursor-grab p-1 hover:bg-white/5 rounded text-slate-500 hover:text-slate-300 active:cursor-grabbing touch-none select-none"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={16} />
      </div>

      <button
        type="button"
        onClick={onEdit}
        className="flex-1 min-w-0 flex items-center gap-2 text-left"
      >
        <span className="text-sm font-medium text-slate-200 truncate">
          {field.label}
        </span>
        <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg bg-slate-700/60 text-slate-400">
          {field.type}
        </span>
        {field.required && (
          <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-400">
            Requerido
          </span>
        )}
        <span className="shrink-0 text-[10px] font-mono px-2 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-300">
          {field.mapsTo ?? 'Sin mapeo'}
        </span>
      </button>

      <button
        type="button"
        onClick={onRemove}
        className="shrink-0 inline-flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
        aria-label={`Eliminar ${field.label}`}
      >
        <Trash2 size={13} />
      </button>
    </div>
  );
};

export const FormFieldsTab: React.FC<FormFieldsTabProps> = ({ template }) => {
  const [fields, setFields] = useState<FormField[]>(template.fields);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingField, setEditingField] = useState<FormField | null>(null);
  const replaceFields = useReplaceFormFields(template.id);

  useEffect(() => {
    setFields(template.fields);
  }, [template.fields]);

  const isDirty = JSON.stringify(fields) !== JSON.stringify(template.fields);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setFields((items) => {
        const oldIndex = items.findIndex((i) => i.fieldKey === active.id);
        const newIndex = items.findIndex((i) => i.fieldKey === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleAdd = () => {
    setEditingField(null);
    setSidebarOpen(true);
  };

  const handleEdit = (field: FormField) => {
    setEditingField(field);
    setSidebarOpen(true);
  };

  const handleRemove = (fieldKey: string) => {
    setFields((items) => items.filter((f) => f.fieldKey !== fieldKey));
  };

  const handleSidebarSave = (saved: FormField) => {
    setFields((items) => {
      const index = items.findIndex((f) => f.fieldKey === editingField?.fieldKey);
      if (index === -1) return [...items, saved];
      const next = [...items];
      next[index] = saved;
      return next;
    });
  };

  const handleSaveChanges = () => {
    replaceFields.mutate(fields);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-200">Campos del formulario</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Arrastrá para reordenar. Los cambios se guardan al hacer click en
            &quot;Guardar cambios&quot;.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold bg-slate-800 text-slate-200 hover:bg-slate-700 transition-all shrink-0"
        >
          <Plus size={14} /> Agregar campo
        </button>
      </div>

      {fields.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-12 text-center rounded-xl border border-dashed border-white/10">
          <Settings2 size={20} className="text-slate-600" />
          <p className="text-sm text-slate-500">
            Este formulario todavía no tiene campos.
          </p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={fields.map((f) => f.fieldKey)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {fields.map((field) => (
                <SortableFieldRow
                  key={field.fieldKey}
                  field={field}
                  onEdit={() => handleEdit(field)}
                  onRemove={() => handleRemove(field.fieldKey)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={handleSaveChanges}
          disabled={!isDirty || replaceFields.isPending}
          className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold bg-primary text-white shadow-lg shadow-primary/20 hover:opacity-90 transition-all disabled:opacity-50"
        >
          {replaceFields.isPending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          Guardar cambios
        </button>
      </div>

      <FormFieldSidebar
        open={sidebarOpen}
        field={editingField}
        onClose={() => setSidebarOpen(false)}
        onSave={handleSidebarSave}
      />
    </div>
  );
};
