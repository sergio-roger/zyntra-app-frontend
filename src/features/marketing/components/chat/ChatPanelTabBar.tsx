import React from 'react';
import { ChatPanelTab } from '@features/marketing/types/chat-mock';

const TAB_LABELS: Record<ChatPanelTab, string> = {
  process: 'Proceso del equipo',
  tools: 'Herramientas',
  tasks: 'Tareas',
  files: 'Archivos',
};

interface ChatPanelTabBarProps {
  activeTab: ChatPanelTab;
  onSelectTab: (tab: ChatPanelTab) => void;
}

export const ChatPanelTabBar: React.FC<ChatPanelTabBarProps> = ({ activeTab, onSelectTab }) => (
  <div className="flex border-b border-base-300">
    {(Object.keys(TAB_LABELS) as ChatPanelTab[]).map((tab) => (
      <button
        key={tab}
        onClick={() => onSelectTab(tab)}
        className={`flex-1 px-3 py-3 text-sm font-medium border-b-2 transition-colors ${
          activeTab === tab
            ? 'border-secondary text-secondary'
            : 'border-transparent text-base-content/50 hover:text-base-content/80'
        }`}
      >
        {TAB_LABELS[tab]}
      </button>
    ))}
  </div>
);
