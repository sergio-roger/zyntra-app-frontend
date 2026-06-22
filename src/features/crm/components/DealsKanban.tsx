import React from 'react';
import { DEAL_STAGES, Deal, DealStage } from '@crm/types';
import { DealsColumn } from './DealsColumn';

interface DealsKanbanProps {
  kanbanData: Record<DealStage, Deal[]>;
  onDealClick?: (deal: Deal) => void;
}

const STAGE_ACCENTS: Record<DealStage, string> = {
  prospecting: 'from-blue-500 to-blue-400',
  qualification: 'from-orange-500 to-orange-400',
  proposal: 'from-indigo-500 to-indigo-400',
  negotiation: 'from-emerald-500 to-emerald-400',
  closing: 'from-purple-500 to-purple-400',
  won: 'from-green-500 to-green-400',
  lost: 'from-rose-500 to-rose-400',
};

export const DealsKanban: React.FC<DealsKanbanProps> = ({ kanbanData, onDealClick }) => {
  return (
    <div className="flex gap-5 overflow-x-auto pb-8 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
      {DEAL_STAGES.map((stage) => (
        <DealsColumn 
          key={stage} 
          stage={stage} 
          deals={kanbanData[stage] || []} 
          accentColor={STAGE_ACCENTS[stage] || 'from-slate-500 to-slate-400'}
          onDealClick={onDealClick}
        />
      ))}
    </div>
  );
};
