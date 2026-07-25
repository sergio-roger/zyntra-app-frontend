import React from 'react';

interface CardWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'highlighted' | 'interactive';
  hoverable?: boolean;
  className?: string;
}

export const CardWrapper: React.FC<CardWrapperProps> = ({
  children,
  variant = 'default',
  hoverable = true,
  className = '',
  ...props
}) => {
  const baseClasses =
    'relative flex flex-col justify-between rounded-xl border transition-all duration-200';

  const variantClasses = {
    default: 'bg-base-200 border-base-300 shadow-md text-base-content',
    highlighted:
      'border-2 border-primary ring-2 ring-primary/20 shadow-lg bg-base-200 text-base-content',
    interactive: 'bg-base-200 border-base-300 text-base-content',
  };

  const hoverClasses =
    hoverable && variant !== 'highlighted'
      ? 'hover:border-base-content/10 hover:shadow-lg hover:-translate-y-0.5'
      : '';

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
