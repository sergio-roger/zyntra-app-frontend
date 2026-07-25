import { ClipboardList, FileText, PlayCircle, Wrench } from 'lucide-react';
import React from 'react';
import { ChatPanelTab } from '@features/marketing/types/chat-mock';

const TAB_ICONS: Record<ChatPanelTab, React.ElementType> = {
  process: PlayCircle,
  tools: Wrench,
  tasks: ClipboardList,
  files: FileText,
};

interface PanelCollapsedTabRailProps {
  activeTab: ChatPanelTab;
  onSelectTab: (tab: ChatPanelTab) => void;
}

export const PanelCollapsedTabRail: React.FC<PanelCollapsedTabRailProps> = ({ activeTab, onSelectTab }) => (
  <div className="flex flex-col items-center gap-2 p-2">
    {(Object.keys(TAB_ICONS) as ChatPanelTab[]).map((tab) => {
      const Icon = TAB_ICONS[tab];
      const isActive = tab === activeTab;
      return (
        <button
          key={tab}
          onClick={() => onSelectTab(tab)}
          className={`w-9 h-9 rounded-lg flex items-center justify-center ${
            isActive ? 'bg-secondary/20 text-secondary' : 'text-base-content/60 hover:bg-base-300'
          }`}
        >
          <Icon size={16} />
        </button>
      );
    })}
  </div>
);
