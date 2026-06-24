import api from '@shared/api/axios';
import {
  Deal,
  ListDealsQuery,
  CreateDealInput,
  UpdateDealInput,
  KanbanResponse,
  DealStageHistoryRecord,
} from '@crm/types/crm';

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

  kanban: (pipelineId: string) =>
    api.get<unknown, { data: KanbanResponse }>(`/crm/deals/kanban/${pipelineId}`),

  get: (id: string) =>
    api.get<unknown, { data: Deal }>(`/crm/deals/${id}`),

  history: (id: string) =>
    api.get<unknown, { data: DealStageHistoryRecord[] }>(`/crm/deals/${id}/history`),

  create: (input: CreateDealInput) =>
    api.post<unknown, { data: Deal }>('/crm/deals', input),

  update: (id: string, input: UpdateDealInput) =>
    api.patch<unknown, { data: Deal }>(`/crm/deals/${id}`, input),

  remove: (id: string) =>
    api.delete(`/crm/deals/${id}`),
};
