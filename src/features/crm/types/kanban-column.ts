import { Deal } from "./deal";
import { DealPipelineStage } from "./deal-pipeline-stage";

export interface KanbanColumn {
  deals: Deal[];
  stage: DealPipelineStage;
  total_value: number;
}
