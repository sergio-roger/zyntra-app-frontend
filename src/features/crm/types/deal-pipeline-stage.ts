export type DealStageType = "active" | "won" | "lost";

export interface DealPipelineStage {
  color: string;
  id: string;
  name: string;
  pipeline_id: string;
  position: number;
  probability_percent: number;
  type: DealStageType;
}
