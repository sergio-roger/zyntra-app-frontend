export type DealStageType = 'active' | 'won' | 'lost';

export interface DealPipelineStage {
  color: string;
  id: string;
  name: string;
  pipelineId: string;
  position: number;
  probabilityPercent: number;
  type: DealStageType;
}
