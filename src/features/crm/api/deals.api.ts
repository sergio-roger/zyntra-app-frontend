import api from '@shared/api/axios';
import type { Deal, ListDealsQuery, DealStage } from '@crm/types';

const buildQS = (q: Record<string, unknown>): string => {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(q)) {
    if (v !== undefined && v !== null && v !== '') sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : '';
};

export const dealsApi = {
  list: (query: ListDealsQuery = {}) =>
    api.get<unknown, { data: { items: Deal[]; total: number; page: number; totalPages: number } }>(
      `/crm/deals${buildQS(query as Record<string, unknown>)}`,
    ),

  kanban: () => 
    api.get<unknown, { data: Record<DealStage, Deal[]> }>('/crm/deals/kanban'),

  get: (id: string) => 
    api.get<unknown, { data: Deal }>(`/crm/deals/${id}`),

  create: (input: Partial<Deal>) =>
    api.post<unknown, { data: Deal }>('/crm/deals', input),

  update: (id: string, input: Partial<Deal>) =>
    api.patch<unknown, { data: Deal }>(`/crm/deals/${id}`, input),

  remove: (id: string) => 
    api.delete(`/crm/deals/${id}`),
};
