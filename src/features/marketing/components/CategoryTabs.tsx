import { ChevronDown } from 'lucide-react';
import React from 'react';
import { AgentCategory, SystemAgentStatus } from '../types/agents';

export type StatusFilter = 'all' | SystemAgentStatus;

const STATUS_LABELS: Record<StatusFilter, string> = {
  all: 'Todos',
  active: 'Activo',
  coming_soon: 'Próximamente',
};

interface CategoryTabsProps {
  categories: AgentCategory[];
  activeCategoryId: string | null;
  onCategoryChange: (categoryId: string | null) => void;
  statusFilter: StatusFilter;
  onStatusChange: (status: StatusFilter) => void;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  activeCategoryId,
  onCategoryChange,
  statusFilter,
  onStatusChange,
}) => (
  <div className="flex flex-wrap items-center justify-between gap-3">
    <div role="tablist" className="tabs tabs-boxed w-fit">
      <button
        role="tab"
        className={`tab ${activeCategoryId === null ? 'tab-active' : ''}`}
        onClick={() => onCategoryChange(null)}
      >
        Todos
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          role="tab"
          className={`tab ${activeCategoryId === category.id ? 'tab-active' : ''}`}
          onClick={() => onCategoryChange(category.id)}
        >
          {category.name}
        </button>
      ))}
    </div>

    <details className="dropdown dropdown-end">
      <summary className="btn btn-sm btn-outline gap-1">
        Estado: {STATUS_LABELS[statusFilter]}
        <ChevronDown size={14} />
      </summary>
      <ul className="dropdown-content menu bg-base-100 rounded-box shadow-md z-10 w-40 p-2 border border-base-200">
        {(Object.keys(STATUS_LABELS) as StatusFilter[]).map((status) => (
          <li key={status}>
            <button onClick={() => onStatusChange(status)}>
              {STATUS_LABELS[status]}
            </button>
          </li>
        ))}
      </ul>
    </details>
  </div>
);
