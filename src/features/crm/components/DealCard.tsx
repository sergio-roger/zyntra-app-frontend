import { Deal } from '@crm/types/deal';
import { useDraggable } from '@dnd-kit/core';
import { Building2, Calendar, GripVertical, TrendingUp, User } from 'lucide-react';
import React from 'react';

interface DealCardProps {
  deal: Deal;
  onClick?: (deal: Deal) => void;
  isDragging?: boolean;
}

export const DealCard: React.FC<DealCardProps> = ({ deal, onClick, isDragging = false }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging: isBeingDragged } = useDraggable({
    id: deal.id,
    data: { stageId: deal.stage_id },
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  const currency = deal.currency || 'COP';
  const formattedValue = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(deal.value);

  const stageColor = deal.stage?.color;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex flex-col gap-3 rounded-xl border bg-slate-800/40 p-4 transition-all cursor-pointer shadow-lg select-none ${
        isBeingDragged || isDragging
          ? 'opacity-40 border-indigo-500/40 scale-[0.98]'
          : 'border-white/[0.05] active:scale-[0.98]'
      }`}
      onClick={() => !isBeingDragged && onClick?.(deal)}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-bold text-white line-clamp-2 leading-tight">
          {deal.title}
        </h4>
        <div className="flex items-center gap-1 shrink-0">
          <div className="flex items-center gap-1 rounded-md bg-slate-900/50 px-1.5 py-0.5 text-[10px] font-bold text-indigo-400 border border-indigo-500/20">
            <TrendingUp size={10} />
            {deal.stage?.probability_percent ?? deal.probability}%
          </div>
          {/* Drag handle */}
          <div
            {...listeners}
            {...attributes}
            className="p-0.5 rounded text-slate-600 hover:text-slate-400 cursor-grab active:cursor-grabbing transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical size={14} />
          </div>
        </div>
      </div>

      {stageColor && (
        <div
          className="h-0.5 w-full rounded-full opacity-60"
          style={{ backgroundColor: stageColor }}
        />
      )}

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <User size={14} className="text-slate-500" />
          <span className="truncate">{deal.contact?.name || 'Contacto desconocido'}</span>
        </div>

        {deal.contact?.company?.name && (
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <Building2 size={13} className="text-slate-600" />
            <span className="truncate">{deal.contact.company.name}</span>
          </div>
        )}
      </div>

      <div className="mt-1 flex items-center justify-between border-t border-white/[0.05] pt-3">
        <span className="text-xs font-bold text-indigo-400">{formattedValue}</span>

        {deal.expected_close_date && (
          <div className="flex items-center gap-1 text-[10px] text-slate-500">
            <Calendar size={12} />
            <span>{new Date(deal.expected_close_date).toLocaleDateString('es-CO')}</span>
          </div>
        )}
      </div>
    </div>
  );
};
