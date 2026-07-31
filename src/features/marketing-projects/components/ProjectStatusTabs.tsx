import React from 'react';
import { MarketingProjectStatus } from '@features/marketing-projects/enums/marketing-project-status.enum';

interface ProjectStatusTabsProps {
  value: MarketingProjectStatus | 'all';
  onChange: (value: MarketingProjectStatus | 'all') => void;
}

const TABS: { value: MarketingProjectStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: MarketingProjectStatus.ACTIVE, label: 'Activos' },
  { value: MarketingProjectStatus.PAUSED, label: 'En Pausa' },
  { value: MarketingProjectStatus.COMPLETED, label: 'Completados' },
];

export const ProjectStatusTabs: React.FC<ProjectStatusTabsProps> = ({ value, onChange }) => (
  <div role="tablist" className="flex gap-1 border-b border-base-300">
    {TABS.map((tab) => (
      <button
        key={tab.value}
        type="button"
        role="tab"
        aria-selected={value === tab.value}
        onClick={() => onChange(tab.value)}
        className={`px-3 py-2 text-sm font-bold border-b-2 transition-colors duration-200 cursor-pointer ${
          value === tab.value
            ? 'border-primary text-primary'
            : 'border-transparent text-base-content/50 hover:text-base-content'
        }`}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

export default ProjectStatusTabs;
