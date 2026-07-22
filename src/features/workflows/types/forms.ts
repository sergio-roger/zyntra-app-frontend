import { CustomFieldType } from '@crm/types/custom-field';

export enum FormStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export enum FormSubmitAction {
  CREATE_CONTACT = 'create_contact',
  CREATE_LEAD = 'create_lead',
  WEBHOOK_ONLY = 'webhook_only',
  CUSTOM = 'custom',
}

export enum FormTargetEntityType {
  CONTACT = 'contact',
  COMPANY = 'company',
  DEAL = 'deal',
}

export interface FormFieldValidation {
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  regex?: string;
}

export interface FormField {
  /** Ausente en campos nuevos aún no guardados en el backend. */
  id?: string;
  fieldKey: string;
  label: string;
  type: CustomFieldType;
  options?: string[] | null;
  required: boolean;
  mapsTo?: string | null;
  placeholder?: string | null;
  validation?: FormFieldValidation | null;
}

export interface FormTemplate {
  id: string;
  businessId: string;
  name: string;
  slug: string;
  description?: string | null;
  status: FormStatus;
  submitAction: FormSubmitAction;
  targetEntityType?: FormTargetEntityType | null;
  successMessage?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FormTemplateWithFields extends FormTemplate {
  fields: FormField[];
}

export interface FormSubmission {
  id: string;
  formTemplateId: string;
  businessId: string;
  data: Record<string, unknown>;
  contactId: string | null;
  companyId: string | null;
  sourceChannel: string | null;
  createdAt: string;
}

export interface FormSubmissionsPage {
  items: FormSubmission[];
  total: number;
  page: number;
  limit: number;
}

export type CreateFormTemplatePayload = Pick<FormTemplate, 'name' | 'slug'> &
  Partial<
    Pick<
      FormTemplate,
      'description' | 'status' | 'submitAction' | 'targetEntityType' | 'successMessage'
    >
  >;

export type UpdateFormTemplatePayload = Partial<CreateFormTemplatePayload>;
