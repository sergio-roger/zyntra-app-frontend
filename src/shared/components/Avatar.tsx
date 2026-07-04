import React from 'react';

interface AvatarProps {
  name?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
  size?: number;
  rounded?: 'full' | '2xl';
  className?: string;
}

const GRADIENTS: [string, string][] = [
  ['#6366f1', '#8b5cf6'],
  ['#ec4899', '#f43f5e'],
  ['#0ea5e9', '#06b6d4'],
  ['#10b981', '#059669'],
  ['#f59e0b', '#f97316'],
  ['#8b5cf6', '#6366f1'],
  ['#14b8a6', '#0ea5e9'],
  ['#ef4444', '#ec4899'],
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getInitials(name?: string | null, email?: string | null): string {
  const source = name?.trim() || email?.trim() || '';
  if (!source) return '?';
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return source.substring(0, 2).toUpperCase();
}

export function getAvatarGradient(seed: string): string {
  const [from, to] = GRADIENTS[hashString(seed) % GRADIENTS.length];
  return `linear-gradient(135deg, ${from}, ${to})`;
}

/**
 * Deterministic per-user fallback avatar (initials + hashed color), shown
 * whenever avatarUrl is missing — same identity always renders the same avatar.
 */
export const Avatar: React.FC<AvatarProps> = ({
  name,
  email,
  avatarUrl,
  size = 40,
  rounded = 'full',
  className = '',
}) => {
  const seed = (email || name || 'user').trim().toLowerCase();
  const radiusClass = rounded === 'full' ? 'rounded-full' : 'rounded-2xl';
  const style: React.CSSProperties = {
    width: size,
    height: size,
    fontSize: Math.max(10, Math.round(size * 0.36)),
  };

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name || email || 'avatar'}
        style={style}
        className={`shrink-0 object-cover shadow-lg ${radiusClass} ${className}`}
      />
    );
  }

  return (
    <div
      style={{ ...style, background: getAvatarGradient(seed) }}
      className={`flex shrink-0 select-none items-center justify-center font-bold text-white shadow-lg ${radiusClass} ${className}`}
    >
      {getInitials(name, email)}
    </div>
  );
};
