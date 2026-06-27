import { CustomFieldConditionBuilder } from '@crm/components/CustomFieldConditionBuilder';
import { SegmentCondition } from '@crm/types/segment-condition';
import { FilterX, X } from 'lucide-react';
import React from 'react';

interface CustomFieldFilterSidebarProps {
  open: boolean;
  conditions: SegmentCondition[];
  onChange: (conditions: SegmentCondition[]) => void;
  onClose: () => void;
}

export const CustomFieldFilterSidebar: React.FC<CustomFieldFilterSidebarProps> = ({
  open,
  conditions,
  onChange,
  onClose,
}) => (
  <>
    {open && (
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
    )}
    <div
      className={`fixed inset-y-0 right-0 z-50 flex w-[460px] max-w-full flex-col border-l border-white/10 bg-slate-900 shadow-2xl transition-transform duration-300 ease-in-out ${
        open ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <div>
          <h2 className="text-sm font-bold text-white">Filtros de campos personalizados</h2>
          <p className="mt-0.5 text-xs text-slate-400">Define condiciones para filtrar contactos</p>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        <CustomFieldConditionBuilder conditions={conditions} onChange={onChange} />
      </div>

      <div className="flex items-center justify-between border-t border-white/10 px-5 py-4">
        <span className="text-xs text-slate-400">
          {conditions.length === 0
            ? 'Sin condiciones activas'
            : `${conditions.length} condición${conditions.length !== 1 ? 'es' : ''} activa${conditions.length !== 1 ? 's' : ''}`}
        </span>
        <div className="flex items-center gap-2">
          {conditions.length > 0 && (
            <button
              onClick={() => onChange([])}
              className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/20 bg-rose-500/5 px-3 py-1.5 text-xs font-medium text-rose-400 transition-colors hover:bg-rose-500/10"
            >
              <FilterX size={13} /> Limpiar
            </button>
          )}
          <button
            onClick={onClose}
            className="rounded-xl bg-primary px-5 py-2 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-px active:scale-95"
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>
  </>
);
