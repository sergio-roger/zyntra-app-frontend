import React from 'react';
import { Calendar, User, Building2, TrendingUp } from 'lucide-react';
import { Deal } from '@crm/types';

interface DealCardProps {
  deal: Deal;
  onClick?: (deal: Deal) => void;
}

export const DealCard: React.FC<DealCardProps> = ({ deal, onClick }) => {
  const formattedValue = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(deal.value);

  return (
    <div 
      onClick={() => onClick?.(deal)}
      className="group flex flex-col gap-3 rounded-xl border border-white/[0.05] bg-slate-800/40 p-4 transition-all hover:bg-slate-800/60 hover:border-white/[0.1] hover:-translate-y-0.5 cursor-pointer shadow-lg active:scale-[0.98]"
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-bold text-white line-clamp-2 leading-tight group-hover:text-indigo-400 transition-colors">
          {deal.title}
        </h4>
        <div className="flex items-center gap-1 shrink-0 rounded-md bg-slate-900/50 px-1.5 py-0.5 text-[10px] font-bold text-indigo-400 border border-indigo-500/20">
          <TrendingUp size={10} />
          {deal.probability}%
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <User size={14} className="text-slate-500" />
          <span className="truncate">{deal.contact?.name || 'Contacto desconocido'}</span>
        </div>
        
        {deal.contact?.company_name && (
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <Building2 size={13} className="text-slate-600" />
            <span className="truncate">{deal.contact.company_name}</span>
          </div>
        )}
      </div>

      <div className="mt-1 flex items-center justify-between border-t border-white/[0.05] pt-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
          <span className="text-indigo-400">{formattedValue}</span>
        </div>
        
        {deal.expected_close_date && (
          <div className="flex items-center gap-1 text-[10px] text-slate-500">
            <Calendar size={12} />
            <span>{new Date(deal.expected_close_date).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </div>
  );
};
