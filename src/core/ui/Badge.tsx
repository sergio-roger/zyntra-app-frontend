import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, className = '' }) => {
  return (
    <span
      className={`badge badge-outline text-[9px] font-bold h-auto py-1 px-2 whitespace-nowrap ${className}`}
    >
      {children}
    </span>
  );
};
