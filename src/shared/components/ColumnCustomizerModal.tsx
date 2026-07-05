import { CustomField } from '@crm/types/custom-field';
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
import { ColumnConfig } from '@shared/types/column';
import { GripVertical, Settings2, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface ColumnCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customFields: CustomField[];
  currentConfig: ColumnConfig[];
  defaultColumns: ColumnConfig[];
  onSave: (config: ColumnConfig[]) => void;
}

interface SortableItemProps {
  col: ColumnConfig;
  onToggleVisible: (key: string) => void;
}

const SortableItem: React.FC<SortableItemProps> = ({
  col,
  onToggleVisible,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: col.key });

  const style = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  const isNameColumn = col.key === 'name';

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

      <label className="flex items-center gap-3 flex-1 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={col.visible}
          disabled={isNameColumn}
          onChange={() => onToggleVisible(col.key)}
          className={`checkbox checkbox-sm rounded-lg transition-all ${
            isNameColumn
              ? 'checkbox-disabled'
              : 'checkbox-primary border-slate-600 bg-slate-950'
          }`}
        />
        <span
          className={`text-sm font-medium ${
            col.visible ? 'text-slate-200' : 'text-slate-500'
          }`}
        >
          {col.label}
          {isNameColumn && (
            <span className="text-[10px] text-indigo-400 font-bold ml-1.5 uppercase">
              Requerido
            </span>
          )}
        </span>
      </label>
    </div>
  );
};

export const ColumnCustomizerModal: React.FC<ColumnCustomizerModalProps> = ({
  isOpen,
  onClose,
  customFields,
  currentConfig,
  defaultColumns,
  onSave,
}) => {
  const [config, setConfig] = useState<ColumnConfig[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    // Build the list of all possible columns
    const allAvailable = [
      ...defaultColumns,
      ...customFields
        .filter((cf) => cf.is_active)
        .map((cf) => ({
          key: cf.name,
          label: `${cf.label} (Campo Personalizado)`,
          visible: false,
        })),
    ];

    const newConfig: ColumnConfig[] = [];

    currentConfig.forEach((saved) => {
      const match = allAvailable.find((avail) => avail.key === saved.key);
      if (match) {
        newConfig.push({
          key: saved.key,
          label: match.label,
          visible: saved.visible,
        });
      }
    });

    allAvailable.forEach((avail) => {
      const alreadyAdded = newConfig.some((c) => c.key === avail.key);
      if (!alreadyAdded) {
        newConfig.push(avail);
      }
    });

    setConfig(newConfig);
  }, [isOpen, currentConfig, customFields]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setConfig((items) => {
        const oldIndex = items.findIndex((i) => i.key === active.id);
        const newIndex = items.findIndex((i) => i.key === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleToggleVisible = (key: string) => {
    if (key === 'name') return; // name cannot be toggled
    setConfig((items) =>
      items.map((item) =>
        item.key === key ? { ...item, visible: !item.visible } : item,
      ),
    );
  };

  const handleReset = () => {
    const defaultFields = [
      ...defaultColumns,
      ...customFields
        .filter((cf) => cf.is_active)
        .map((cf) => ({
          key: cf.name,
          label: `${cf.label} (Campo Personalizado)`,
          visible: false,
        })),
    ];
    setConfig(defaultFields);
  };

  const handleApply = () => {
    onSave(config);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="fixed inset-0 flex items-center justify-center p-4 z-[100] pointer-events-none">
        <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] pointer-events-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/5 bg-slate-900/50 backdrop-blur-md">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Settings2 size={18} className="text-indigo-400" />
                Personalizar Columnas
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Selecciona y arrastra para reordenar las columnas de la tabla.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-2">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={config.map((c) => c.key)}
                strategy={verticalListSortingStrategy}
              >
                {config.map((col) => (
                  <SortableItem
                    key={col.key}
                    col={col}
                    onToggleVisible={handleToggleVisible}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between p-4 border-t border-white/5 bg-slate-950/40">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
            >
              Restablecer
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleApply}
                className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
              >
                Aplicar cambios
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
