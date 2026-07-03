import { DealStatus } from "@crm/types/crm";

export interface ListDealsQuery {
  assignedToId?: string;
  contactId?: string;
  limit?: number;
  page?: number;
  pipelineId?: string;
  search?: string;
  stageId?: string;
  status?: DealStatus;
  teamId?: string;
}
