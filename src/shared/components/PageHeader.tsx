import React from 'react';
import { PageHeaderProps } from '@shared/types/page-header-props';

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  badge,
  actions,
  children,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-white tracking-tight">
            {title}
          </h2>
          {badge}
        </div>
        {subtitle && <p className="text-sm text-slate-400">{subtitle}</p>}
        {children}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
};

export default PageHeader;
