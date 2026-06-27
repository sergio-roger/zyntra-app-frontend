import { CustomFieldType } from '@crm/types/crm';

export interface CustomField {
  business_id: string;
  created_at: string;
  id: string;
  is_active: boolean;
  label: string;
  name: string;
  options: string[] | null;
  required: boolean;
  type: CustomFieldType;
}
