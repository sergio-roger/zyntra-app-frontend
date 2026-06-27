import { DealPipelineStage } from './deal-pipeline-stage';

export interface DealPipeline {
  business_id: string;
  created_at: string;
  deleted_at: string | null;
  id: string;
  is_default: boolean;
  name: string;
  position: number;
  stages: DealPipelineStage[];
  team_id: string | null;
  team?: { id: string; name: string; color: string } | null;
  updated_at: string;
}
