import { DealPipelineStage } from "./deal-pipeline-stage";

export interface DealStageHistoryRecord {
  deal_id: string;
  entered_at: string;
  id: string;
  left_at: string | null;
  stage_id: string;
  stage?: DealPipelineStage;
}
