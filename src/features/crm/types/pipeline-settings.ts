import { DealPipelineStage } from "@crm/types/deal-pipeline-stage";

export type StageType = "active" | "won" | "lost";

export interface EditableStage extends DealPipelineStage {
  _dirty?: boolean;
}
