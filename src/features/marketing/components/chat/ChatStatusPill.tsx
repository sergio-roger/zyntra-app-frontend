import React from 'react';
import { ProcessEventStatus } from '@features/marketing/types/chat-mock';

interface ChatStatusPillProps {
  status: ProcessEventStatus;
}

const STATUS_CONFIG: Record<ProcessEventStatus, { label: string; className: string }> = {
  completed: { label: 'Completado', className: 'bg-success/15 text-success' },
  in_progress: { label: 'En progreso', className: 'bg-warning/15 text-warning' },
  pending: { label: 'Pendiente', className: 'bg-base-content/10 text-base-content/50' },
};

export const ChatStatusPill: React.FC<ChatStatusPillProps> = ({ status }) => {
  const config = STATUS_CONFIG[status];
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${config.className}`}>
      {config.label}
    </span>
  );
};
