import { YoutubeCredentialStatus } from '@features/youtube-analytics/types/own-channel.type';

interface DisconnectedChannelCopy {
  title: string;
  description: string;
}

const DISCONNECTED_CHANNEL_COPY: Record<
  Exclude<YoutubeCredentialStatus, 'connected'>,
  DisconnectedChannelCopy
> = {
  expired: {
    title: 'Tu conexión con YouTube expiró',
    description:
      'Reconectá tu cuenta de Google para seguir recolectando datos de tu canal. Tu historial ya guardado no se pierde.',
  },
  revoked: {
    title: 'Se revocó el acceso a tu cuenta de YouTube',
    description:
      'Quitaste el permiso desde tu cuenta de Google (o se quitó automáticamente). Volvé a autorizar el acceso para seguir recolectando datos. Tu historial ya guardado no se pierde.',
  },
};

export const getDisconnectedCopy = (
  status: Exclude<YoutubeCredentialStatus, 'connected'>,
): DisconnectedChannelCopy => DISCONNECTED_CHANNEL_COPY[status];
