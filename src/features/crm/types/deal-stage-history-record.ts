import { DealPipelineStage } from './deal-pipeline-stage';

export interface DealStageHistoryRecord {
  dealId: string;
  enteredAt: string;
  id: string;
  leftAt: string | null;
  stageId: string;
  stage?: DealPipelineStage;
}
