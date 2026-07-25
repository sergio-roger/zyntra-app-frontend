import { Check, Loader2, User } from 'lucide-react';
import React from 'react';
import { ProcessTimelineEvent } from '@features/marketing/types/chat-mock';
import { ChatStatusPill } from '@features/marketing/components/chat/ChatStatusPill';

interface ProcessTimelineItemProps {
  event: ProcessTimelineEvent;
}

const STATUS_ICON: Record<ProcessTimelineEvent['status'], React.ReactNode> = {
  completed: <Check size={14} className="text-success" />,
  in_progress: <Loader2 size={14} className="text-warning animate-spin" />,
  pending: <User size={14} className="text-base-content/40" />,
};

export const ProcessTimelineItem: React.FC<ProcessTimelineItemProps> = ({ event }) => (
  <div className="flex gap-3">
    <div className="w-7 h-7 rounded-full bg-base-300 flex items-center justify-center shrink-0">
      {STATUS_ICON[event.status]}
    </div>
    <div className="flex-1 min-w-0 pb-4 border-l border-base-300 -ml-3.5 pl-6 -mt-1">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-base-content/40">{event.time}</p>
        <ChatStatusPill status={event.status} />
      </div>
      <p className="text-sm mt-0.5">
        <span className="font-semibold">{event.actorDisplayName}</span>
        {event.actorRole && <span className="text-base-content/40"> ({event.actorRole})</span>}
      </p>
      <p className="text-sm text-base-content/70">{event.description}</p>
      {event.tools && (
        <div className="mt-2 flex flex-col gap-1">
          <p className="text-[11px] text-base-content/40">Herramientas usadas</p>
          {event.tools.map((tool) => (
            <div key={tool} className="flex items-center justify-between text-xs">
              <span className="text-base-content/70">{tool}</span>
              <Check size={12} className="text-success" />
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);
