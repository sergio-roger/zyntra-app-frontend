import { Wrench } from 'lucide-react';
import React from 'react';
import { ToolMockItem } from '@features/marketing/types/chat-mock';

interface ToolsTabContentProps {
  tools: ToolMockItem[];
}

export const ToolsTabContent: React.FC<ToolsTabContentProps> = ({ tools }) => (
  <div className="p-4 flex flex-col gap-2">
    {tools.map((tool) => (
      <div
        key={tool.name}
        className="flex items-center justify-between gap-3 p-3 rounded-lg bg-base-200 border border-base-300"
      >
        <div className="flex items-center gap-2 min-w-0">
          <Wrench size={14} className="text-secondary shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{tool.name}</p>
            <p className="text-xs text-base-content/40">{tool.ownerDisplayName}</p>
          </div>
        </div>
        <span className="text-xs text-base-content/50 whitespace-nowrap">{tool.usageCount}x</span>
      </div>
    ))}
  </div>
);
