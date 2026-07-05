import api from '@shared/api/axios';
import { ApiResponse, unwrap } from '@core/types/api';
import {
  Channel,
  ChannelType,
  CreateChannelPayload,
  EmbedSnippetResponse,
  UpdateChannelPayload,
} from '../types/channels.types';

export const channelsApi = {
  // ── Channel Store (catálogo de tipos disponibles) ────────────────────────
  getStore: (): Promise<ChannelType[]> =>
    api
      .get<unknown, ApiResponse<ChannelType[]>>('/channels/store')
      .then(unwrap),

  // ── CRUD de canales del business ─────────────────────────────────────────
  list: (businessId: string): Promise<Channel[]> =>
    api
      .get<unknown, ApiResponse<Channel[]>>(
        `/businesses/${businessId}/channels`,
      )
      .then(unwrap),

  get: (businessId: string, channelId: string): Promise<Channel> =>
    api
      .get<unknown, ApiResponse<Channel>>(
        `/businesses/${businessId}/channels/${channelId}`,
      )
      .then(unwrap),

  create: (
    businessId: string,
    payload: CreateChannelPayload,
  ): Promise<Channel> =>
    api
      .post<unknown, ApiResponse<Channel>>(
        `/businesses/${businessId}/channels`,
        payload,
      )
      .then(unwrap),

  update: (
    businessId: string,
    channelId: string,
    payload: UpdateChannelPayload,
  ): Promise<Channel> =>
    api
      .patch<unknown, ApiResponse<Channel>>(
        `/businesses/${businessId}/channels/${channelId}`,
        payload,
      )
      .then(unwrap),

  remove: (
    businessId: string,
    channelId: string,
  ): Promise<{ success: boolean }> =>
    api
      .delete<unknown, ApiResponse<{ success: boolean }>>(
        `/businesses/${businessId}/channels/${channelId}`,
      )
      .then(unwrap),

  // ── Agente asignado ──────────────────────────────────────────────────────
  assignAgent: (
    businessId: string,
    channelId: string,
    agentId: string,
  ): Promise<Channel> =>
    api
      .post<unknown, ApiResponse<Channel>>(
        `/businesses/${businessId}/channels/${channelId}/agent`,
        { agentId },
      )
      .then(unwrap),

  unassignAgent: (businessId: string, channelId: string): Promise<Channel> =>
    api
      .delete<unknown, ApiResponse<Channel>>(
        `/businesses/${businessId}/channels/${channelId}/agent`,
      )
      .then(unwrap),

  // ── Embed snippet (solo canales de tipo web_chat) ────────────────────────
  getEmbedSnippet: (channelId: string): Promise<EmbedSnippetResponse> =>
    api
      .get<unknown, ApiResponse<EmbedSnippetResponse>>(
        `/channels/${channelId}/embed-snippet`,
      )
      .then(unwrap),
};
