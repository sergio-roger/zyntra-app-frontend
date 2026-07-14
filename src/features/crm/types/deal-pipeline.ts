import { DealPipelineStage } from './deal-pipeline-stage';

export interface DealPipeline {
  businessId: string;
  createdAt: string;
  deletedAt: string | null;
  id: string;
  isDefault: boolean;
  name: string;
  position: number;
  stages: DealPipelineStage[];
  teamId: string | null;
  team?: { id: string; name: string; color: string } | null;
  updatedAt: string;
}
