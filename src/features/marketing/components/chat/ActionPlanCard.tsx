import { ListChecks } from 'lucide-react';
import React from 'react';
import { ActionPlanStep } from '@features/marketing/types/chat-mock';

interface ActionPlanCardProps {
  steps: ActionPlanStep[];
}

export const ActionPlanCard: React.FC<ActionPlanCardProps> = ({ steps }) => (
  <div className="rounded-xl border border-base-300 bg-base-100/60 p-4">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <ListChecks size={16} className="text-secondary" />
        Plan de Acción Generado
      </div>
      <button className="text-xs text-secondary hover:underline">Ver plan completo</button>
    </div>
    <div className="flex items-start overflow-x-auto">
      {steps.map((step, index) => (
        <React.Fragment key={step.order}>
          {index > 0 && <div className="h-px w-3 bg-base-300 mt-3.5 shrink-0" />}
          <div className="flex flex-col items-center text-center w-16 shrink-0">
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                step.isCurrent
                  ? 'bg-secondary text-white'
                  : 'bg-base-300 text-base-content/70'
              }`}
            >
              {step.order}
            </span>
            <p className="text-[11px] mt-1 leading-tight">{step.label}</p>
            <p className="text-[10px] text-base-content/40 leading-tight">{step.ownerDisplayName}</p>
          </div>
        </React.Fragment>
      ))}
    </div>
  </div>
);
