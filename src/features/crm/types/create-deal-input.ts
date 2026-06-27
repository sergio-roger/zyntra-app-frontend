export interface CreateDealInput {
  assigned_to_id?: string;
  contact_id: string;
  currency?: string;
  description?: string;
  expected_close_date?: string;
  pipeline_id: string;
  probability?: number;
  stage_id: string;
  team_id?: string;
  title: string;
  value: number;
}
