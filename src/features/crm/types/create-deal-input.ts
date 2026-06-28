export interface CreateDealInput {
  assignedToId?: string;
  companyId?: string;
  contactId: string;
  currency?: string;
  description?: string;
  expectedCloseDate?: string;
  pipelineId: string;
  probability?: number;
  stageId: string;
  teamId?: string;
  title: string;
  value: number;
}
