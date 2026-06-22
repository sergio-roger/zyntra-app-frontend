import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { findActiveModule } from '@shared/layouts/nav.config';

interface BreadcrumbsProps {
  pathname: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ pathname }) => {
  const module = findActiveModule(pathname);
  const sub = module?.children?.find(
    (c) => pathname === c.to || pathname.startsWith(`${c.to}/`),
  );

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-1.5 text-sm text-base-content/60"
    >
      {module ? (
        <Link
          to={module.to}
          className="font-medium text-base-content transition-colors hover:text-primary"
        >
          {module.label}
        </Link>
      ) : (
        <span className="font-medium text-base-content">Zyntra</span>
      )}
      {sub && (
        <>
          <ChevronRight size={14} className="text-base-content/35" />
          <span className="text-base-content/80">{sub.label}</span>
        </>
      )}
    </nav>
  );
};
