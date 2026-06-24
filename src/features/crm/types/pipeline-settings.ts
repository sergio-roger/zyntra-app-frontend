import { DealPipelineStage } from '@crm/types/crm';

export type StageType = 'active' | 'won' | 'lost';

export interface EditableStage extends DealPipelineStage {
  _dirty?: boolean;
}
