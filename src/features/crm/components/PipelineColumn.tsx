import React from 'react';
import { ContactCard } from './ContactCard';
import type { Contact, ContactStage } from '@crm/types';
import { STAGE_LABELS } from '@crm/types';

interface PipelineColumnProps {
  stage: ContactStage;
  contacts: Contact[];
  accentColor: string;
}

export const PipelineColumn: React.FC<PipelineColumnProps> = ({ stage, contacts, accentColor }) => {
  const totalValue = contacts.reduce((sum, c) => sum + Number(c.deal_value || 0), 0);

  return (
    <div className="flex flex-col gap-4 min-w-[280px] w-full max-w-[320px] bg-slate-900/30 rounded-2xl p-4 border border-white/[0.02]">
      <div className={`h-1 w-full rounded-full bg-gradient-to-r ${accentColor} opacity-70 mb-1`} />
      
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-slate-100">{STAGE_LABELS[stage]}</h3>
          <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-slate-800 px-1.5 text-[10px] font-bold text-slate-400">
            {contacts.length}
          </span>
        </div>
        <span className="text-sm font-bold text-indigo-400">
          ${totalValue.toLocaleString()}
        </span>
      </div>

      <div className="flex flex-col gap-3 min-h-[500px]">
        {contacts.map((contact) => (
          <ContactCard key={contact.id} contact={contact} />
        ))}
        {contacts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 opacity-30 border-2 border-dashed border-white/10 rounded-xl">
            <p className="text-xs text-slate-500">Sin oportunidades</p>
          </div>
        )}
      </div>
    </div>
  );
};
