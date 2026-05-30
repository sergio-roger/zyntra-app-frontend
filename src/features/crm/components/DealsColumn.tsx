import React from 'react';
import { DealCard } from './DealCard';
import type { Deal, DealStage } from '@crm/types';
import { DEAL_STAGE_LABELS } from '@crm/types';

interface DealsColumnProps {
  stage: DealStage;
  deals: Deal[];
  accentColor: string;
  onDealClick?: (deal: Deal) => void;
}

export const DealsColumn: React.FC<DealsColumnProps> = ({ stage, deals, accentColor, onDealClick }) => {
  const totalValue = deals.reduce((sum, d) => sum + Number(d.value || 0), 0);
  
  const formattedTotal = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(totalValue);

  return (
    <div className="flex flex-col gap-4 min-w-[280px] w-full max-w-[320px] bg-slate-900/40 rounded-2xl p-4 border border-white/[0.03] backdrop-blur-sm">
      {/* Header with accent */}
      <div className="flex flex-col gap-3">
        <div className={`h-1 w-full rounded-full bg-gradient-to-r ${accentColor} opacity-80`} />
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">{DEAL_STAGE_LABELS[stage]}</h3>
            <span className="flex h-5 min-w-[22px] items-center justify-center rounded-full bg-slate-800 border border-white/5 px-1.5 text-[10px] font-bold text-slate-400">
              {deals.length}
            </span>
          </div>
        </div>
        <div className="px-1">
          <span className="text-xs font-bold text-slate-500">Total: </span>
          <span className="text-sm font-black text-indigo-400">{formattedTotal}</span>
        </div>
      </div>

      {/* Cards container */}
      <div className="flex flex-col gap-3 min-h-[500px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
        {deals.map((deal) => (
          <DealCard key={deal.id} deal={deal} onClick={onDealClick} />
        ))}
        
        {deals.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 opacity-30 border-2 border-dashed border-white/5 rounded-2xl bg-white/[0.02]">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Vacío</p>
          </div>
        )}
      </div>
    </div>
  );
};
