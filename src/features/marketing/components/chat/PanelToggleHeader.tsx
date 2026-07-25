import { PanelRightClose, PanelRightOpen } from 'lucide-react';
import React from 'react';

interface PanelToggleHeaderProps {
  isCollapsed: boolean;
  onToggleCollapsed: () => void;
}

export const PanelToggleHeader: React.FC<PanelToggleHeaderProps> = ({ isCollapsed, onToggleCollapsed }) => (
  <div className="flex items-center justify-between gap-2 p-3 border-b border-base-300">
    {!isCollapsed && <p className="text-sm font-semibold px-1">Actividad</p>}
    <button
      onClick={onToggleCollapsed}
      className="w-8 h-8 rounded-lg flex items-center justify-center text-base-content/60 hover:bg-base-300 hover:text-secondary shrink-0"
      title={isCollapsed ? 'Expandir panel' : 'Contraer panel'}
    >
      {isCollapsed ? <PanelRightOpen size={16} /> : <PanelRightClose size={16} />}
    </button>
  </div>
);
