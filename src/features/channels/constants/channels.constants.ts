import React from 'react';
import { Globe, MessageCircle, Send } from 'lucide-react';
import { WebChannelFormStep } from '@features/channels/store/store.types';

// ─── Orden de pasos del stepform de canal web ─────────────────────────────────
export const WEB_CHANNEL_FORM_STEPS: WebChannelFormStep[] = [
  'identity',
  'appearance',
  'security',
  'agent',
  'summary',
];

export const WEB_CHANNEL_FORM_STEP_LABELS: Record<WebChannelFormStep, string> = {
  identity: 'Identidad',
  appearance: 'Apariencia',
  security: 'Seguridad',
  agent: 'Agente',
  summary: 'Resumen',
};

// ─── Íconos de canales ────────────────────────────────────────────────────────
export const CHANNEL_ICONS: Record<string, React.ReactNode> = {
  web_chat: React.createElement(Globe, { size: 22 }),
  facebook: React.createElement(MessageCircle, { size: 22 }),
  telegram: React.createElement(Send, { size: 22 }),
};
