import React, { useEffect } from 'react';
import { WebChannelFormValues } from '@features/channels/schemas/web-channel.schema';

export const useIsDark = (theme: WebChannelFormValues['theme']) => {
  const [prefersDark, setPrefersDark] = React.useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setPrefersDark(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return theme === 'dark' || (theme === 'auto' && prefersDark);
};
