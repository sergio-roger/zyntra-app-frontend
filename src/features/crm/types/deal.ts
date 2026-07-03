import { Company } from "./company";
import { Contact } from "./contact";
import { DealPipeline } from "./deal-pipeline";
import { DealPipelineStage } from "./deal-pipeline-stage";

export type DealStatus = "open" | "won" | "lost" | "abandoned";

export interface Deal {
  assignedTo?: any;
  assignedToId: string | null;
  businessId: string;
  closedAt: string | null;
  companyId?: string | null;
  company?: Company;
  contacts?: Contact[];
  createdAt: string;
  currency: string;
  description: string | null;
  expectedCloseDate: string | null;
  id: string;
  pipeline?: DealPipeline;
  pipelineId: string;
  probability: number;
  stage?: DealPipelineStage;
  stageId: string;
  status: DealStatus;
  team?: any;
  teamId: string | null;
  title: string;
  updatedAt: string;
  value: number;
}
