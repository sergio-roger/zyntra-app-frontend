import { ContactSource, ContactStage } from '@crm/types/crm';

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  stage: ContactStage | '';
  lifecycle_stage_id: string;
  source: ContactSource;
  owner_id: string;
  tags: string[];
  notes: string;
  custom_fields: Record<string, any>;
}
