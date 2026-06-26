import api from '@shared/api/axios';
import { ConvertToDealInput, Deal } from '@crm/types/crm';
import { mapContact, mapContactsList } from '@crm/api/crm.api';

const buildQS = (q: Record<string, unknown>): string => {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(q)) {
    if (v !== undefined && v !== null && v !== '') sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : '';
};

export interface ListLeadsQuery {
  search?: string;
  source?: string;
  tag?: string;
  page?: number;
  limit?: number;
}

export const leadsApi = {
  list: (query: ListLeadsQuery = {}) =>
    api
      .get<unknown, { data: any }>(
        `/crm/contacts${buildQS({ ...query, stage: 'lead', isArchived: false } as Record<string, unknown>)}`,
      )
      .then((r) => ({ data: mapContactsList(r.data) })),

  archive: (id: string) =>
    api
      .patch<unknown, { data: any }>(`/crm/contacts/${id}/archive`, {})
      .then((r) => ({ data: mapContact(r.data) })),

  convertToDeal: (id: string, input: ConvertToDealInput) =>
    api.post<unknown, { data: Deal }>(`/crm/contacts/${id}/convert-to-deal`, input),
};
