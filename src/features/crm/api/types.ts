import type { Contact, ActivityType } from '@crm/types';

export interface CreateContactInput {
  name: string;
  email?: string;
  phone?: string;
  stage?: Contact['stage'];
  lifecycle_stage_id?: string;
  source?: Contact['source'];
  tags?: string[];
  notes?: string;
  custom_fields?: Record<string, any>;
  is_lead?: boolean;
}

export type UpdateContactInput = Partial<CreateContactInput>;

export interface CreateActivityInput {
  type: ActivityType;
  content: string;
  metadata?: Record<string, unknown>;
}

export interface CreateTagInput {
  name: string;
  color?: string;
  description?: string;
}

export type UpdateTagInput = Partial<CreateTagInput>;

export interface CreateCustomFieldInput {
  name: string;
  label: string;
  type: string;
  options?: string[];
  required?: boolean;
}

export type UpdateCustomFieldInput = Partial<Omit<CreateCustomFieldInput, 'name' | 'type'>> & {
  is_active?: boolean;
};
