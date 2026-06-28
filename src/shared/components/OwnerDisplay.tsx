import React from 'react';

interface OwnerDisplayProps {
  owner?: { name: string } | null;
  className?: string;
}

export const OwnerDisplay: React.FC<OwnerDisplayProps> = ({ owner, className = '' }) => {
  if (!owner || !owner.name) {
    return <span className="text-slate-600">—</span>;
  }

  const initial = owner.name.charAt(0).toUpperCase();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-800 text-[10px] font-medium text-slate-300 ring-1 ring-slate-700 select-none">
        {initial}
      </div>
      <span className="truncate text-xs text-slate-300">{owner.name}</span>
    </div>
  );
};
