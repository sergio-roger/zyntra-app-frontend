import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { segmentsApi } from '@crm/api/segments.api';
import { CreateSegmentInput, UpdateSegmentInput } from '@crm/types';

export const segmentsKeys = {
  all: ['segments'] as const,
  lists: () => ['segments', 'list'] as const,
  detail: (id: string) => ['segments', 'detail', id] as const,
  contacts: (id: string, query: { page?: number; limit?: number }) => ['segments', 'contacts', id, query] as const,
  preview: (conditions: any[], query: { page?: number; limit?: number }) => ['segments', 'preview', conditions, query] as const,
};

export const useSegmentsList = () =>
  useQuery({
    queryKey: segmentsKeys.lists(),
    queryFn: async () => {
      const res = await segmentsApi.list();
      return res.data;
    },
  });

export const useSegmentDetail = (id: string) =>
  useQuery({
    queryKey: segmentsKeys.detail(id),
    queryFn: async () => {
      const res = await segmentsApi.get(id);
      return res.data;
    },
    enabled: !!id,
  });

export const useSegmentContacts = (id: string, query: { page?: number; limit?: number } = {}) =>
  useQuery({
    queryKey: segmentsKeys.contacts(id, query),
    queryFn: async () => {
      const res = await segmentsApi.getContacts(id, query);
      return res.data;
    },
    enabled: !!id,
  });

export const usePreviewContacts = (conditions: any[], query: { page?: number; limit?: number } = {}, enabled = true) =>
  useQuery({
    queryKey: segmentsKeys.preview(conditions, query),
    queryFn: async () => {
      const res = await segmentsApi.previewContacts(conditions, query);
      return res.data;
    },
    enabled: enabled && conditions.length > 0,
  });

export const useCreateSegment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateSegmentInput) => {
      const res = await segmentsApi.create(input);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: segmentsKeys.all });
    },
  });
};

export const useUpdateSegment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: UpdateSegmentInput }) => {
      const res = await segmentsApi.update(id, input);
      return res.data;
    },
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: segmentsKeys.all });
      qc.invalidateQueries({ queryKey: segmentsKeys.detail(variables.id) });
    },
  });
};

export const useDeleteSegment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => segmentsApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: segmentsKeys.all });
    },
  });
};
