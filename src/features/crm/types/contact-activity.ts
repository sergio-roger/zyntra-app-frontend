import { ActivityType, ActivityCreatedBy } from '@crm/types/crm';

export interface ContactActivity {
  contact_id: string;
  content: string;
  created_at: string;
  created_by: ActivityCreatedBy;
  id: string;
  metadata: Record<string, unknown>;
  type: ActivityType;
}
