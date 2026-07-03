import { DealPipelineStage } from './deal-pipeline-stage';

export interface DealPipeline {
  businessId: string;
  createdAt: string;
  deleted_at: string | null;
  id: string;
  is_default: boolean;
  name: string;
  position: number;
  stages: DealPipelineStage[];
  team_id: string | null;
  team?: { id: string; name: string; color: string } | null;
  updatedAt: string;
}
