import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@features/auth/store/authStore';
import { channelsApi } from '../api/channels.api';
import {
  CreateChannelPayload,
  UpdateChannelPayload,
} from '../types/channels.types';

const useBusinessId = () => useAuthStore((s) => s.user?.businessId ?? '');

export const channelsKeys = {
  all: (businessId: string) => ['channels', businessId] as const,
  lists: (businessId: string) =>
    [...channelsKeys.all(businessId), 'list'] as const,
  list: (businessId: string) =>
    [...channelsKeys.lists(businessId)] as const,
  details: (businessId: string) =>
    [...channelsKeys.all(businessId), 'detail'] as const,
  detail: (businessId: string, channelId: string) =>
    [...channelsKeys.details(businessId), channelId] as const,
  embedSnippet: (channelId: string) =>
    ['channels', 'embed-snippet', channelId] as const,
  store: () => ['channels', 'store'] as const,
} as const;

// ─── Helper: invalida lista y detalle después de mutaciones ──────────────────
const invalidateAll = (
  qc: ReturnType<typeof useQueryClient>,
  businessId: string,
) => {
  qc.invalidateQueries({ queryKey: channelsKeys.lists(businessId) });
};

// ─── Queries ──────────────────────────────────────────────────────────────────

export const useChannelsQuery = (businessId?: string) => {
  const authBusinessId = useBusinessId();
  const bid = businessId ?? authBusinessId;
  return useQuery({
    queryKey: channelsKeys.list(bid),
    queryFn: () => channelsApi.list(bid),
    enabled: !!bid,
  });
};

/**
 * Detalle de un canal individual.
 * Equivalente a GET /businesses/:businessId/channels/:id
 */
export const useChannelQuery = (channelId: string) => {
  const businessId = useBusinessId();
  return useQuery({
    queryKey: channelsKeys.detail(businessId, channelId),
    queryFn: () => channelsApi.get(businessId, channelId),
    enabled: !!businessId && !!channelId,
  });
};

export const useChannelStoreQuery = () =>
  useQuery({
    queryKey: channelsKeys.store(),
    queryFn: channelsApi.getStore,
    staleTime: 10 * 60 * 1000,
  });

export const useEmbedSnippetQuery = (channelId: string) =>
  useQuery({
    queryKey: channelsKeys.embedSnippet(channelId),
    queryFn: () => channelsApi.getEmbedSnippet(channelId),
    enabled: !!channelId,
    staleTime: 5 * 60 * 1000,
  });

// ─── Mutaciones ───────────────────────────────────────────────────────────────

/** POST /businesses/:businessId/channels */
export const useCreateChannelMutation = () => {
  const qc = useQueryClient();
  const businessId = useBusinessId();
  return useMutation({
    mutationFn: (payload: CreateChannelPayload) =>
      channelsApi.create(businessId, payload),
    onSuccess: () => invalidateAll(qc, businessId),
  });
};

/** PATCH /businesses/:businessId/channels/:id */
export const useUpdateChannelMutation = (channelId: string) => {
  const qc = useQueryClient();
  const businessId = useBusinessId();
  return useMutation({
    mutationFn: (payload: UpdateChannelPayload) =>
      channelsApi.update(businessId, channelId, payload),
    onSuccess: () => {
      invalidateAll(qc, businessId);
      qc.invalidateQueries({
        queryKey: channelsKeys.detail(businessId, channelId),
      });
      // Invalida también el snippet por si cambió la config
      qc.invalidateQueries({
        queryKey: channelsKeys.embedSnippet(channelId),
      });
    },
  });
};

/**
 * Desactiva el canal (status → inactive). El canal sigue existiendo
 * y sigue siendo visible en las listas, solo deja de responder.
 */
export const useDeactivateChannelMutation = () => {
  const qc = useQueryClient();
  const businessId = useBusinessId();
  return useMutation({
    mutationFn: (channelId: string) =>
      channelsApi.update(businessId, channelId, { status: 'inactive' }),
    onSuccess: (_, channelId) => {
      invalidateAll(qc, businessId);
      qc.invalidateQueries({
        queryKey: channelsKeys.detail(businessId, channelId),
      });
    },
  });
};

/**
 * Elimina el canal (DELETE). El backend hace soft-delete real
 * (`deleted_at`), por lo que el canal deja de aparecer en cualquier
 * listado pero se conserva en la base de datos.
 */
export const useRemoveChannelMutation = () => {
  const qc = useQueryClient();
  const businessId = useBusinessId();
  return useMutation({
    mutationFn: (channelId: string) => channelsApi.remove(businessId, channelId),
    onSuccess: (_, channelId) => {
      invalidateAll(qc, businessId);
      qc.invalidateQueries({
        queryKey: channelsKeys.detail(businessId, channelId),
      });
    },
  });
};

/** POST /businesses/:businessId/channels/:id/agent */
export const useAssignAgentMutation = (channelId: string) => {
  const qc = useQueryClient();
  const businessId = useBusinessId();
  return useMutation({
    mutationFn: (agentId: string) =>
      channelsApi.assignAgent(businessId, channelId, agentId),
    onSuccess: () => {
      invalidateAll(qc, businessId);
      qc.invalidateQueries({
        queryKey: channelsKeys.detail(businessId, channelId),
      });
    },
  });
};

/** DELETE /businesses/:businessId/channels/:id/agent */
export const useUnassignAgentMutation = (channelId: string) => {
  const qc = useQueryClient();
  const businessId = useBusinessId();
  return useMutation({
    mutationFn: () => channelsApi.unassignAgent(businessId, channelId),
    onSuccess: () => {
      invalidateAll(qc, businessId);
      qc.invalidateQueries({
        queryKey: channelsKeys.detail(businessId, channelId),
      });
    },
  });
};
