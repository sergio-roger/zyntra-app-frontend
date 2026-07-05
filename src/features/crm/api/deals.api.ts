import api from '@shared/api/axios';
import { ApiResponse } from '@core/types/api';
import { UpdateDealInput } from '@crm/types/crm';
import { Deal } from '@crm/types/deal';
import { ListDealsQuery } from '@crm/types/list-deals-query';
import { CreateDealInput } from '@crm/types/create-deal-input';
import { KanbanResponse } from '@crm/types/kanban-response';
import { DealStageHistoryRecord } from '@crm/types/deal-stage-history-record';

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
    api.get<
      unknown,
      ApiResponse<{
        items: Deal[];
        total: number;
        page: number;
        totalPages: number;
      }>
    >(`/crm/deals${buildQS(query as Record<string, unknown>)}`),

  kanban: (pipelineId: string) =>
    api.get<unknown, ApiResponse<KanbanResponse>>(
      `/crm/deals/kanban/${pipelineId}`,
    ),

  get: (id: string) => api.get<unknown, ApiResponse<Deal>>(`/crm/deals/${id}`),

  history: (id: string) =>
    api.get<unknown, ApiResponse<DealStageHistoryRecord[]>>(
      `/crm/deals/${id}/history`,
    ),

  create: (input: CreateDealInput) =>
    api.post<unknown, ApiResponse<Deal>>('/crm/deals', input),

  update: (id: string, input: UpdateDealInput) =>
    api.patch<unknown, ApiResponse<Deal>>(`/crm/deals/${id}`, input),

  remove: (id: string) => api.delete(`/crm/deals/${id}`),
};
