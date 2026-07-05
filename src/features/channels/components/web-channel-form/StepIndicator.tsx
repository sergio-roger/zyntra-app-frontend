import React from 'react';
import { Check } from 'lucide-react';
import { WebChannelFormStep } from '@features/channels/store/store.types';
import {
  WEB_CHANNEL_FORM_STEPS,
  WEB_CHANNEL_FORM_STEP_LABELS,
} from '@features/channels/constants/channels.constants';

interface StepIndicatorProps {
  current: WebChannelFormStep;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ current }) => {
  const currentIdx = WEB_CHANNEL_FORM_STEPS.indexOf(current);

  return (
    <div className="flex items-start w-full mb-8">
      {WEB_CHANNEL_FORM_STEPS.map((step, i) => {
        const isDone = i < currentIdx;
        const isActive = i === currentIdx;
        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center gap-2">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold shrink-0 transition-colors ${
                  isDone || isActive
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                {isDone ? <Check size={14} /> : i + 1}
              </div>
              <span
                className={`text-xs font-medium whitespace-nowrap ${
                  isDone || isActive ? 'text-white' : 'text-slate-500'
                }`}
              >
                {WEB_CHANNEL_FORM_STEP_LABELS[step]}
              </span>
            </div>
            {i < WEB_CHANNEL_FORM_STEPS.length - 1 && (
              <div
                className={`flex-1 h-px mt-4 mx-2 transition-colors ${
                  isDone ? 'bg-indigo-600' : 'bg-slate-800'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
