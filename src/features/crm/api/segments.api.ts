import api from '@shared/api/axios';
import { Segment, CreateSegmentInput, UpdateSegmentInput, ContactsListResponse } from '@crm/types/crm';

const buildQS = (q: Record<string, unknown>): string => {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(q)) {
    if (v !== undefined && v !== null && v !== '') sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : '';
};

export const segmentsApi = {
  list: () =>
    api.get<unknown, { data: Segment[] }>('/crm/segments'),

  get: (id: string) =>
    api.get<unknown, { data: Segment }>(`/crm/segments/${id}`),

  create: (input: CreateSegmentInput) =>
    api.post<unknown, { data: Segment }>('/crm/segments', input),

  update: (id: string, input: UpdateSegmentInput) =>
    api.patch<unknown, { data: Segment }>(`/crm/segments/${id}`, input),

  remove: (id: string) =>
    api.delete(`/crm/segments/${id}`),

  getContacts: (id: string, query: { page?: number; limit?: number } = {}) =>
    api.get<unknown, { data: ContactsListResponse }>(
      `/crm/segments/${id}/contacts${buildQS(query)}`,
    ),

  previewContacts: (conditions: any[], query: { page?: number; limit?: number } = {}) =>
    api.post<unknown, { data: ContactsListResponse }>(
      `/crm/segments/preview${buildQS(query)}`,
      { conditions },
    ),
};
