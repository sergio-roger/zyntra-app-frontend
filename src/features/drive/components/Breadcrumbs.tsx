import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { useDriveBreadcrumb } from '@features/drive/hooks/use-drive-folders';

interface BreadcrumbsProps {
  folderId: string | undefined;
  onNavigate: (folderId: string | undefined) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ folderId, onNavigate }) => {
  const { data: crumbs = [] } = useDriveBreadcrumb(folderId);

  return (
    <div className="flex flex-wrap items-center gap-1.5 text-sm">
      <button
        onClick={() => onNavigate(undefined)}
        className="flex items-center gap-1.5 rounded-lg px-2 py-1 font-semibold text-slate-400 transition-colors hover:bg-white/5 hover:text-slate-200"
      >
        <Home size={14} />
        Inicio
      </button>
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;
        return (
          <React.Fragment key={crumb.id}>
            <ChevronRight size={14} className="shrink-0 text-slate-600" />
            <button
              onClick={() => onNavigate(crumb.id)}
              disabled={isLast}
              className={`rounded-lg px-2 py-1 font-semibold transition-colors ${
                isLast
                  ? 'text-white cursor-default'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              {crumb.name}
            </button>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Breadcrumbs;
