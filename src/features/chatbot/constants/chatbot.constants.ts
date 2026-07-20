export const STATUS_DOTS: Record<string, string> = {
  open: 'bg-success',
  closed: 'bg-base-content/30',
  bot: 'bg-warning',
  human: 'bg-info',
};

export const getStatusDot = (status: string) => STATUS_DOTS[status] || 'bg-base-content/30';

export const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: 'open', label: 'Abierta' },
  { value: 'closed', label: 'Cerrada' },
  { value: 'bot', label: 'Bot' },
  { value: 'human', label: 'Humano' },
];

export const getStatusLabel = (status: string) =>
  STATUS_OPTIONS.find((opt) => opt.value === status)?.label || status;

export const VIEW_TABS: { key: 'all' | 'mine' | 'unread'; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'mine', label: 'Míos' },
  { key: 'unread', label: 'No Leídos' },
];

export interface AssigneeLike {
  id: string;
  name: string;
}

/** Quién atiende la conversación ahora mismo: un humano asignado, o el agente IA del canal. */
export const getAttendedByInfo = (
  assignedTo: AssigneeLike | null | undefined,
  assistantAgent: AssigneeLike | null | undefined,
  isMine: boolean,
): { kind: 'human' | 'ai'; label: string } => {
  const hasHuman = !!assignedTo && assignedTo.id !== 'system';
  if (hasHuman) {
    return {
      kind: 'human',
      label: `Asignada a ${isMine ? 'ti' : assignedTo!.name}`,
    };
  }
  return {
    kind: 'ai',
    label: assistantAgent
      ? `Atendida por IA: ${assistantAgent.name}`
      : 'Atendida por IA',
  };
};

export const formatDate = (dateStr?: string) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('es', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
};
