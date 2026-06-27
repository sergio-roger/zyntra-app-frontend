import { ActivityType } from "@crm/types/crm";
import { Contact } from "@crm/types/contact";

export interface CreateContactInput {
  name: string;
  email?: string;
  phone?: string;
  lifecycleStageId?: string;
  source?: Contact["source"];
  ownerId?: string | null;
  tags?: string[];
  notes?: string;
  customFields?: Record<string, any>;
  isLead?: boolean;
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

export type UpdateCustomFieldInput = Partial<
  Omit<CreateCustomFieldInput, "name" | "type">
> & {
  is_active?: boolean;
};
