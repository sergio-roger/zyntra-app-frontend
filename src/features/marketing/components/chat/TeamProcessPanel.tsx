import React, { useState } from 'react';
import { ChatPanelTab } from '@features/marketing/types/chat-mock';
import {
  FILES_TAB_MOCK,
  PROCESS_TIMELINE,
  TASKS_TAB_MOCK,
  TOOLS_TAB_MOCK,
} from '@features/marketing/constants/chat-mock-data';
import { ChatPanelTabBar } from '@features/marketing/components/chat/ChatPanelTabBar';
import { ProcessTimeline } from '@features/marketing/components/chat/ProcessTimeline';
import { ToolsTabContent } from '@features/marketing/components/chat/ToolsTabContent';
import { TasksTabContent } from '@features/marketing/components/chat/TasksTabContent';
import { FilesTabContent } from '@features/marketing/components/chat/FilesTabContent';

const PLAN_LABEL = 'Lanzamiento de producto – 500 leads en 60 días';

export const TeamProcessPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ChatPanelTab>('process');

  return (
    <div className="w-full lg:w-[420px] shrink-0 flex flex-col bg-base-200 border border-base-300 rounded-2xl overflow-hidden">
      <ChatPanelTabBar activeTab={activeTab} onSelectTab={setActiveTab} />
      <div className="flex-1 min-h-0 flex flex-col">
        {activeTab === 'process' && <ProcessTimeline planLabel={PLAN_LABEL} events={PROCESS_TIMELINE} />}
        {activeTab !== 'process' && (
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'tools' && <ToolsTabContent tools={TOOLS_TAB_MOCK} />}
            {activeTab === 'tasks' && <TasksTabContent tasks={TASKS_TAB_MOCK} />}
            {activeTab === 'files' && <FilesTabContent files={FILES_TAB_MOCK} />}
          </div>
        )}
      </div>
    </div>
  );
};
