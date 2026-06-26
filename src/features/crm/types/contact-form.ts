import { ContactSource } from '@crm/types/crm';

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  lifecycleStageId: string;
  source: ContactSource;
  ownerId: string | null;
  tags: string[];
  notes: string;
  customFields: Record<string, any>;
}

