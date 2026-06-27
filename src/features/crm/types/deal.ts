import { Contact } from './contact';
import { DealPipeline } from './deal-pipeline';
import { DealPipelineStage } from './deal-pipeline-stage';

export type DealStatus = 'open' | 'won' | 'lost' | 'abandoned';

export interface Deal {
  assigned_to_id: string | null;
  assigned_to?: any;
  business_id: string;
  closed_at: string | null;
  contact_id: string;
  contact?: Contact;
  created_at: string;
  currency: string;
  description: string | null;
  expected_close_date: string | null;
  id: string;
  pipeline_id: string;
  pipeline?: DealPipeline;
  probability: number;
  stage_id: string;
  stage?: DealPipelineStage;
  status: DealStatus;
  team_id: string | null;
  team?: any;
  title: string;
  updated_at: string;
  value: number;
}
