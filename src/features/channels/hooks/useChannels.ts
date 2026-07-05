import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@features/auth/store/authStore';
import { channelsApi } from '../api/channels.api';
import {
  CreateChannelPayload,
  UpdateChannelPayload,
} from '../types/channels.types';

const useBusinessId = () => useAuthStore((s) => s.user?.businessId ?? '');

export const useChannelStore = () =>
  useQuery({ queryKey: ['channel-store'], queryFn: channelsApi.getStore });

export const useChannels = () => {
  const businessId = useBusinessId();
  return useQuery({
    queryKey: ['channels', businessId],
    queryFn: () => channelsApi.list(businessId),
    enabled: !!businessId,
  });
};

export const useChannel = (channelId: string) => {
  const businessId = useBusinessId();
  return useQuery({
    queryKey: ['channels', businessId, channelId],
    queryFn: () => channelsApi.get(businessId, channelId),
    enabled: !!businessId && !!channelId,
  });
};

export const useCreateChannel = () => {
  const qc = useQueryClient();
  const businessId = useBusinessId();
  return useMutation({
    mutationFn: (payload: CreateChannelPayload) =>
      channelsApi.create(businessId, payload),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['channels', businessId] }),
  });
};

export const useUpdateChannel = (channelId: string) => {
  const qc = useQueryClient();
  const businessId = useBusinessId();
  return useMutation({
    mutationFn: (payload: UpdateChannelPayload) =>
      channelsApi.update(businessId, channelId, payload),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['channels', businessId] }),
  });
};

export const useDeleteChannel = () => {
  const qc = useQueryClient();
  const businessId = useBusinessId();
  return useMutation({
    mutationFn: (channelId: string) =>
      channelsApi.remove(businessId, channelId),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['channels', businessId] }),
  });
};

export const useAssignAgent = (channelId: string) => {
  const qc = useQueryClient();
  const businessId = useBusinessId();
  return useMutation({
    mutationFn: (agentId: string) =>
      channelsApi.assignAgent(businessId, channelId, agentId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['channels', businessId] });
      qc.invalidateQueries({ queryKey: ['channels', businessId, channelId] });
    },
  });
};

export const useUnassignAgent = (channelId: string) => {
  const qc = useQueryClient();
  const businessId = useBusinessId();
  return useMutation({
    mutationFn: () => channelsApi.unassignAgent(businessId, channelId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['channels', businessId] });
      qc.invalidateQueries({ queryKey: ['channels', businessId, channelId] });
    },
  });
};
