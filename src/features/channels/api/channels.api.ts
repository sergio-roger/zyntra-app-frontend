import api from '@shared/api/axios';
import {
  Channel,
  ChannelType,
  CreateChannelPayload,
  EmbedSnippetResponse,
  UpdateChannelPayload,
} from '../types/channels.types';

const unwrap = <T>(res: unknown): T => {
  if (res && typeof res === 'object' && 'data' in (res as object)) {
    return (res as { data: T }).data;
  }
  return res as T;
};

export const channelsApi = {
  // ── Channel Store (catálogo de tipos disponibles) ────────────────────────
  getStore: (): Promise<ChannelType[]> =>
    api.get('/channels/store').then(unwrap<ChannelType[]>),

  // ── CRUD de canales del business ─────────────────────────────────────────
  list: (businessId: string): Promise<Channel[]> =>
    api.get(`/businesses/${businessId}/channels`).then(unwrap<Channel[]>),

  get: (businessId: string, channelId: string): Promise<Channel> =>
    api
      .get(`/businesses/${businessId}/channels/${channelId}`)
      .then(unwrap<Channel>),

  create: (
    businessId: string,
    payload: CreateChannelPayload,
  ): Promise<Channel> =>
    api
      .post(`/businesses/${businessId}/channels`, payload)
      .then(unwrap<Channel>),

  update: (
    businessId: string,
    channelId: string,
    payload: UpdateChannelPayload,
  ): Promise<Channel> =>
    api
      .patch(`/businesses/${businessId}/channels/${channelId}`, payload)
      .then(unwrap<Channel>),

  remove: (
    businessId: string,
    channelId: string,
  ): Promise<{ success: boolean }> =>
    api
      .delete(`/businesses/${businessId}/channels/${channelId}`)
      .then(unwrap<{ success: boolean }>),

  // ── Agente asignado ──────────────────────────────────────────────────────
  assignAgent: (
    businessId: string,
    channelId: string,
    agentId: string,
  ): Promise<Channel> =>
    api
      .post(`/businesses/${businessId}/channels/${channelId}/agent`, {
        agentId,
      })
      .then(unwrap<Channel>),

  unassignAgent: (businessId: string, channelId: string): Promise<Channel> =>
    api
      .delete(`/businesses/${businessId}/channels/${channelId}/agent`)
      .then(unwrap<Channel>),

  // ── Embed snippet (solo canales de tipo web_chat) ────────────────────────
  getEmbedSnippet: (channelId: string): Promise<EmbedSnippetResponse> =>
    api
      .get(`/channels/${channelId}/embed-snippet`)
      .then(unwrap<EmbedSnippetResponse>),
};
