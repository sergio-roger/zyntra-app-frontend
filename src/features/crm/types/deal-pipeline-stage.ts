import { DealStageType } from '@crm/types/crm';

export interface DealPipelineStage {
  color: string;
  id: string;
  name: string;
  pipeline_id: string;
  position: number;
  probability_percent: number;
  type: DealStageType;
}
