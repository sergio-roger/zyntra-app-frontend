import api from '@shared/api/axios';
import { Segment } from '@crm/types/segment';
import { CreateSegmentInput } from '@crm/types/create-segment-input';
import { UpdateSegmentInput } from '@crm/types/update-segment-input';
import { mapContactsList } from './crm.api';

const buildQS = (q: Record<string, unknown>): string => {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(q)) {
    if (v !== undefined && v !== null && v !== '') sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : '';
};

export const segmentsApi = {
  list: () => api.get<unknown, { data: Segment[] }>('/crm/segments'),

  get: (id: string) =>
    api.get<unknown, { data: Segment }>(`/crm/segments/${id}`),

  create: (input: CreateSegmentInput) =>
    api.post<unknown, { data: Segment }>('/crm/segments', input),

  update: (id: string, input: UpdateSegmentInput) =>
    api.patch<unknown, { data: Segment }>(`/crm/segments/${id}`, input),

  remove: (id: string) => api.delete(`/crm/segments/${id}`),

  getContacts: (id: string, query: { page?: number; limit?: number } = {}) =>
    api
      .get<unknown, { data: any }>(
        `/crm/segments/${id}/contacts${buildQS(query)}`,
      )
      .then((r) => ({ data: mapContactsList(r.data) })),

  previewContacts: (
    conditions: any[],
    query: { page?: number; limit?: number } = {},
  ) =>
    api
      .post<unknown, { data: any }>(`/crm/segments/preview${buildQS(query)}`, {
        conditions,
      })
      .then((r) => ({ data: mapContactsList(r.data) })),
};
