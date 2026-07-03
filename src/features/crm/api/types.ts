import { ActivityType } from '@crm/types/crm';
import { Contact } from '@crm/types/contact';

export interface CreateContactInput {
  customFields?: Record<string, any>;
  email?: string;
  isLead?: boolean;
  lifecycleStageId?: string;
  name: string;
  notes?: string;
  ownerId?: string | null;
  phone?: string;
  source?: Contact['source'];
  tags?: string[];
}

export type UpdateContactInput = Partial<CreateContactInput>;

export interface CreateActivityInput {
  type: ActivityType;
  content: string;
  metadata?: Record<string, unknown>;
}

export interface CreateTagInput {
  color?: string;
  description?: string;
  entity_type?: string;
  name: string;
}

export type UpdateTagInput = Partial<CreateTagInput>;

export interface CreateCustomFieldInput {
  label: string;
  name: string;
  options?: string[];
  required?: boolean;
  type: string;
}

export type UpdateCustomFieldInput = Partial<
  Omit<CreateCustomFieldInput, 'name' | 'type'>
> & {
  is_active?: boolean;
};
