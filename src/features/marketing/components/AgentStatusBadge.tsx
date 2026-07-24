import React from 'react';

interface AgentStatusBadgeProps {
  isActive: boolean;
}

export const AgentStatusBadge: React.FC<AgentStatusBadgeProps> = ({ isActive }) => (
  <div className="flex items-center gap-1.5">
    <span
      className={`w-2 h-2 rounded-full ${isActive ? 'bg-success' : 'bg-base-content/30'}`}
    />
    <span className="text-xs text-base-content/60">
      {isActive ? 'Activo' : 'Próximamente'}
    </span>
  </div>
);
