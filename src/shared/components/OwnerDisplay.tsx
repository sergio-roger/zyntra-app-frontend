import React from 'react';

interface OwnerDisplayProps {
  owner?: { name: string; avatarUrl?: string | null } | null;
  className?: string;
}

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export const OwnerDisplay: React.FC<OwnerDisplayProps> = ({
  owner,
  className = '',
}) => {
  if (!owner || !owner.name) {
    return <span className="text-slate-600">—</span>;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {owner.avatarUrl ? (
        <img
          src={owner.avatarUrl}
          alt={owner.name}
          className="h-5 w-5 shrink-0 rounded-full object-cover ring-1 ring-slate-700"
        />
      ) : (
        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-800 text-[8px] font-bold text-slate-300 ring-1 ring-slate-700 select-none tracking-tight">
          {getInitials(owner.name)}
        </div>
      )}
      <span className="truncate text-xs text-slate-300">{owner.name}</span>
    </div>
  );
};
