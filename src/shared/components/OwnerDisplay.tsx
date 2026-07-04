import React from 'react';
import { Avatar } from './Avatar';

interface OwnerDisplayProps {
  owner?: { name: string; avatarUrl?: string | null } | null;
  className?: string;
}

export const OwnerDisplay: React.FC<OwnerDisplayProps> = ({
  owner,
  className = '',
}) => {
  if (!owner || !owner.name) {
    return <span className="text-slate-600">—</span>;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Avatar
        name={owner.name}
        avatarUrl={owner.avatarUrl}
        size={20}
        className="ring-1 ring-slate-700"
      />
      <span className="truncate text-xs text-slate-300">{owner.name}</span>
    </div>
  );
};
