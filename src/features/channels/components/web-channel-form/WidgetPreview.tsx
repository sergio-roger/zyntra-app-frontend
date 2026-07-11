import React from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { useFormContext, useWatch } from 'react-hook-form';
import { WebChannelFormValues, WidgetStatus } from '@features/channels/schemas/web-channel.schema';
import { getEffectiveWidgetStatus } from '@features/channels/utils/availability';

const useIsDark = (theme: WebChannelFormValues['theme']) => {
  const [prefersDark, setPrefersDark] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setPrefersDark(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return theme === 'dark' || (theme === 'auto' && prefersDark);
};

const useTick = (enabled: boolean, intervalMs = 30_000) => {
  const [, setTick] = React.useState(0);

  React.useEffect(() => {
    if (!enabled) return;
    const id = setInterval(() => setTick((t) => t + 1), intervalMs);
    return () => clearInterval(id);
  }, [enabled, intervalMs]);
};

const STATUS_META: Record<WidgetStatus, { label: string; dot: string }> = {
  available: { label: 'En línea', dot: '#22c55e' },
  busy: { label: 'Ocupado', dot: '#f59e0b' },
  offline: { label: 'Fuera de servicio', dot: '#94a3b8' },
};

export const WidgetPreview: React.FC = () => {
  const { control } = useFormContext<WebChannelFormValues>();
  const [primaryColor, position, theme, greeting, assistantName, availabilityMode, manualStatus, businessHours] =
    useWatch({
      control,
      name: [
        'primaryColor',
        'position',
        'theme',
        'greeting',
        'assistantName',
        'availabilityMode',
        'manualStatus',
        'businessHours',
      ],
    });

  useTick(availabilityMode === 'schedule');
  const status = getEffectiveWidgetStatus({ availabilityMode, manualStatus, businessHours });
  const statusMeta = STATUS_META[status];
  const isOffline = status === 'offline';

  const isDark = useIsDark(theme);
  const panelBg = isDark ? '#1e293b' : '#fff';
  const assistantBubbleBg = isDark ? '#334155' : '#f1f5f9';
  const assistantBubbleText = isDark ? '#f8fafc' : '#1e293b';
  const inputBg = isDark ? '#0f172a' : '#fff';
  const inputBorder = isDark ? '#334155' : '#e2e8f0';
  const isLeft = position === 'bottom-left';

  return (
    <div
      data-testid="widget-preview"
      className="relative h-[560px] rounded-2xl bg-slate-950/30 border border-white/5 overflow-hidden"
    >
      <div
        className="absolute bottom-5 w-[300px] rounded-2xl shadow-xl overflow-hidden flex flex-col"
        style={{
          [isLeft ? 'left' : 'right']: '20px',
          height: '440px',
          backgroundColor: panelBg,
        }}
      >
        <div
          className="px-4 py-3 text-white"
          style={{ backgroundColor: primaryColor || '#6366f1' }}
        >
          <p className="text-sm font-semibold truncate">
            {assistantName || 'Asistente'}
          </p>
          <p
            className="flex items-center gap-1.5 text-xs opacity-90"
            data-testid="widget-preview-status"
          >
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: statusMeta.dot }}
            />
            {statusMeta.label}
          </p>
        </div>

        <div className="p-3 flex-1 space-y-2">
          <div
            className="rounded-lg px-3 py-2 text-xs max-w-[85%]"
            style={{ backgroundColor: assistantBubbleBg, color: assistantBubbleText }}
          >
            {greeting || '¡Hola! ¿En qué podemos ayudarte hoy?'}
          </div>
        </div>

        <div
          className="flex items-center gap-1.5 px-3 py-2.5 border-t"
          style={{ borderColor: inputBorder, backgroundColor: panelBg }}
        >
          <div
            className="flex-1 rounded-full px-3 py-1.5 text-xs border"
            style={{
              backgroundColor: inputBg,
              borderColor: inputBorder,
              color: assistantBubbleText,
              opacity: isOffline ? 0.5 : 1,
            }}
          >
            {isOffline ? 'Te responderemos pronto...' : 'Escribe un mensaje...'}
          </div>
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: primaryColor || '#6366f1', opacity: isOffline ? 0.5 : 1 }}
          >
            <Send size={13} color="#fff" />
          </div>
        </div>
      </div>

      <div
        className="absolute w-14 h-14 rounded-full shadow-lg flex items-center justify-center"
        style={{
          [isLeft ? 'left' : 'right']: '20px',
          top: '20px',
          backgroundColor: primaryColor || '#6366f1',
        }}
      >
        <MessageCircle size={24} color="#fff" />
      </div>
    </div>
  );
};
