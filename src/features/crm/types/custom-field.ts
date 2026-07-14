export type CustomFieldType =
  'text' | 'number' | 'date' | 'select' | 'checkbox' | 'url';

export interface CustomField {
  businessId: string;
  createdAt: string;
  entityType: 'contact' | 'company';
  id: string;
  isActive: boolean;
  label: string;
  name: string;
  options: string[] | null;
  required: boolean;
  type: CustomFieldType;
}
