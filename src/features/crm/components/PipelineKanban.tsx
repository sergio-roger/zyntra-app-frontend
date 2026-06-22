import React from 'react';
import { STAGES, Contact } from '@crm/types';
import { PipelineColumn } from './PipelineColumn';

interface PipelineKanbanProps {
  kanbanData: Record<string, Contact[]>;
}

const STAGE_ACCENTS: Record<string, string> = {
  lead: 'from-blue-500 to-blue-400',
  prospect: 'from-orange-500 to-orange-400',
  qualified: 'from-emerald-500 to-emerald-400',
  customer: 'from-purple-500 to-purple-400',
  lost: 'from-rose-500 to-rose-400',
};

export const PipelineKanban: React.FC<PipelineKanbanProps> = ({ kanbanData }) => {
  return (
    <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
      {STAGES.map((stage) => (
        <PipelineColumn 
          key={stage} 
          stage={stage} 
          contacts={kanbanData[stage] || []} 
          accentColor={STAGE_ACCENTS[stage] || 'from-slate-500 to-slate-400'}
        />
      ))}
    </div>
  );
};
