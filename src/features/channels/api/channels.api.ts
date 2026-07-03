import api from '@shared/api/axios';
import type {
  Channel,
  ChannelType,
  CreateChannelPayload,
  UpdateChannelPayload,
} from '../types/channels.types';

const unwrap = <T>(res: unknown): T => {
  if (res && typeof res === 'object' && 'data' in (res as object)) {
    return (res as { data: T }).data;
  }
  return res as T;
};

export const channelsApi = {
  getStore: (): Promise<ChannelType[]> =>
    api.get('/channels/store').then(unwrap),

  list: (businessId: string): Promise<Channel[]> =>
    api.get(`/businesses/${businessId}/channels`).then(unwrap),

  get: (businessId: string, channelId: string): Promise<Channel> =>
    api.get(`/businesses/${businessId}/channels/${channelId}`).then(unwrap),

  create: (businessId: string, payload: CreateChannelPayload): Promise<Channel> =>
    api.post(`/businesses/${businessId}/channels`, payload).then(unwrap),

  update: (businessId: string, channelId: string, payload: UpdateChannelPayload): Promise<Channel> =>
    api.patch(`/businesses/${businessId}/channels/${channelId}`, payload).then(unwrap),

  remove: (businessId: string, channelId: string): Promise<{ success: boolean }> =>
    api.delete(`/businesses/${businessId}/channels/${channelId}`).then(unwrap),

  assignAgent: (businessId: string, channelId: string, agentId: string): Promise<Channel> =>
    api.post(`/businesses/${businessId}/channels/${channelId}/agent`, { agentId }).then(unwrap),

  unassignAgent: (businessId: string, channelId: string): Promise<Channel> =>
    api.delete(`/businesses/${businessId}/channels/${channelId}/agent`).then(unwrap),
};
