import React from 'react';
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
    <ul className="steps steps-horizontal w-full mb-8">
      {WEB_CHANNEL_FORM_STEPS.map((step, i) => (
        <li
          key={step}
          className={`step ${i <= currentIdx ? 'step-primary' : ''}`}
        >
          {WEB_CHANNEL_FORM_STEP_LABELS[step]}
        </li>
      ))}
    </ul>
  );
};
