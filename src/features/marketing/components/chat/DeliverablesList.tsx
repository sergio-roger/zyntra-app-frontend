import React from 'react';
import { Deliverable } from '@features/marketing/types/chat-mock';
import { ChatStatusPill } from '@features/marketing/components/chat/ChatStatusPill';

interface DeliverablesListProps {
  deliverables: Deliverable[];
}

export const DeliverablesList: React.FC<DeliverablesListProps> = ({ deliverables }) => (
  <div className="rounded-xl border border-base-300 bg-base-100/60 p-4">
    <p className="text-sm font-semibold mb-3">Entregables en progreso ({deliverables.length})</p>
    <div className="flex flex-col gap-2">
      {deliverables.map((deliverable) => (
        <div key={deliverable.label} className="flex items-center justify-between gap-3">
          <p className="text-sm text-base-content/80">{deliverable.label}</p>
          <ChatStatusPill status={deliverable.status} />
        </div>
      ))}
    </div>
  </div>
);
