import React from 'react';
import { TaskMockItem } from '@features/marketing/types/chat-mock';
import { ChatStatusPill } from '@features/marketing/components/chat/ChatStatusPill';

interface TasksTabContentProps {
  tasks: TaskMockItem[];
}

export const TasksTabContent: React.FC<TasksTabContentProps> = ({ tasks }) => (
  <div className="p-4 flex flex-col gap-2">
    {tasks.map((task) => (
      <div
        key={task.label}
        className="flex items-center justify-between gap-3 p-3 rounded-lg bg-base-200 border border-base-300"
      >
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{task.label}</p>
          <p className="text-xs text-base-content/40">{task.ownerDisplayName}</p>
        </div>
        <ChatStatusPill status={task.status} />
      </div>
    ))}
  </div>
);
