export const STATUS_BADGES: Record<string, string> = {
  open: 'badge-success',
  closed: 'badge-ghost',
  bot: 'badge-warning',
  human: 'badge-info',
};

export const STATUS_DOTS: Record<string, string> = {
  open: 'bg-success',
  closed: 'bg-base-content/30',
  bot: 'bg-warning',
  human: 'bg-info',
};

export const getStatusBadge = (status: string) => STATUS_BADGES[status] || 'badge-ghost';
export const getStatusDot = (status: string) => STATUS_DOTS[status] || 'bg-base-content/30';

export const VIEW_TABS: { key: 'all' | 'mine' | 'unread'; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'mine', label: 'Míos' },
  { key: 'unread', label: 'No Leídos' },
];

export const formatDate = (dateStr?: string) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('es', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
};
