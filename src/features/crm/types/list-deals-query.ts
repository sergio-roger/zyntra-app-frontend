import { DealStatus } from "@crm/types/crm";

export interface ListDealsQuery {
  assigned_to_id?: string;
  contact_id?: string;
  limit?: number;
  page?: number;
  pipeline_id?: string;
  search?: string;
  stage_id?: string;
  status?: DealStatus;
  team_id?: string;
}
