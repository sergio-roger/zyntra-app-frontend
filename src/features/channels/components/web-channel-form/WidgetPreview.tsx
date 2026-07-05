import React from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { useFormContext, useWatch } from 'react-hook-form';
import { WebChannelFormValues } from '@features/channels/schemas/web-channel.schema';

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

/** Réplica visual estática del widget standalone (frontend/widget/src/index.ts) para previsualizar cambios de apariencia en vivo. */
export const WidgetPreview: React.FC = () => {
  const { control } = useFormContext<WebChannelFormValues>();
  const [primaryColor, position, theme, greeting, assistantName] = useWatch({
    control,
    name: ['primaryColor', 'position', 'theme', 'greeting', 'assistantName'],
  });

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
      className="relative h-72 rounded-2xl bg-slate-950/30 border border-white/5 overflow-hidden"
    >
      <div
        className="absolute bottom-4 w-[220px] rounded-2xl shadow-xl overflow-hidden flex flex-col"
        style={{
          [isLeft ? 'left' : 'right']: '16px',
          backgroundColor: panelBg,
        }}
      >
        <div
          className="px-3 py-2 text-white"
          style={{ backgroundColor: primaryColor || '#6366f1' }}
        >
          <p className="text-xs font-semibold truncate">
            {assistantName || 'Asistente'}
          </p>
          <p className="text-[10px] opacity-80">En línea</p>
        </div>

        <div className="p-2 flex-1 space-y-2">
          <div
            className="rounded-lg px-2 py-1.5 text-[11px] max-w-[85%]"
            style={{ backgroundColor: assistantBubbleBg, color: assistantBubbleText }}
          >
            {greeting || '¡Hola! ¿En qué podemos ayudarte hoy?'}
          </div>
        </div>

        <div
          className="flex items-center gap-1 px-2 py-1.5 border-t"
          style={{ borderColor: inputBorder, backgroundColor: panelBg }}
        >
          <div
            className="flex-1 rounded-full px-2 py-1 text-[10px] border"
            style={{ backgroundColor: inputBg, borderColor: inputBorder, color: assistantBubbleText }}
          >
            Escribe un mensaje...
          </div>
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: primaryColor || '#6366f1' }}
          >
            <Send size={10} color="#fff" />
          </div>
        </div>
      </div>

      <div
        className="absolute w-11 h-11 rounded-full shadow-lg flex items-center justify-center"
        style={{
          [isLeft ? 'left' : 'right']: '16px',
          top: '16px',
          backgroundColor: primaryColor || '#6366f1',
        }}
      >
        <MessageCircle size={20} color="#fff" />
      </div>
    </div>
  );
};
