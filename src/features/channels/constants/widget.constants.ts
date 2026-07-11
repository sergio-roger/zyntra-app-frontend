import { WidgetStatus } from '@features/channels/schemas/web-channel.schema';

export const STATUS_META: Record<WidgetStatus, { label: string; dot: string }> = {
  available: { label: 'En línea', dot: '#22c55e' },
  busy: { label: 'Ocupado', dot: '#f59e0b' },
  offline: { label: 'Fuera de servicio', dot: '#94a3b8' },
};
