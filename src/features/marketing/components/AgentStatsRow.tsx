import React from 'react';
import { SystemAgentCatalogItem } from '@features/marketing/types/agents';

interface AgentStatsRowProps {
  agent: SystemAgentCatalogItem;
}

export const AgentStatsRow: React.FC<AgentStatsRowProps> = ({ agent }) => (
  <div className="grid grid-cols-2 gap-2 text-sm">
    <div>
      <p className="text-base-content/50">Tareas hoy</p>
      <p className="font-semibold">
        {agent.tasksDoneToday} / {agent.tasksTotalToday}
      </p>
    </div>
    <div>
      <p className="text-base-content/50">Eficiencia</p>
      <p className="font-semibold text-success">{agent.efficiency}%</p>
    </div>
  </div>
);
