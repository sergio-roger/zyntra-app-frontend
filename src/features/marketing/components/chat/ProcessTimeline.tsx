import { PlayCircle } from 'lucide-react';
import React from 'react';
import { ProcessTimelineEvent } from '@features/marketing/types/chat-mock';
import { ProcessTimelineItem } from '@features/marketing/components/chat/ProcessTimelineItem';

interface ProcessTimelineProps {
  planLabel: string;
  events: ProcessTimelineEvent[];
}

export const ProcessTimeline: React.FC<ProcessTimelineProps> = ({ planLabel, events }) => (
  <div className="flex flex-col h-full">
    <div className="flex items-center justify-between gap-2 p-4 border-b border-base-300">
      <div className="flex items-center gap-2 min-w-0">
        <PlayCircle size={16} className="text-secondary shrink-0" />
        <p className="text-sm font-semibold truncate">Ejecutando plan: {planLabel}</p>
      </div>
      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-success/15 text-success whitespace-nowrap">
        En ejecución
      </span>
    </div>
    <div className="flex-1 overflow-y-auto p-4">
      <button className="text-xs text-secondary hover:underline mb-3">Ver 3 eventos anteriores</button>
      {events.map((event) => (
        <ProcessTimelineItem key={event.id} event={event} />
      ))}
    </div>
    <div className="p-4 border-t border-base-300">
      <button className="btn btn-sm w-full rounded-lg border-none bg-secondary text-white hover:bg-secondary/80">
        Ver reporte completo
      </button>
    </div>
  </div>
);
