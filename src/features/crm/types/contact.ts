import { ContactSource } from '@crm/types/crm';
import { LifecycleStage } from './lifecycle-stage';
import { CrmMember } from './crm-member';
import { Tag } from './tag';

export interface Contact {
  businessId: string;
  companyName: string | null;
  createdAt: string;
  customFields: Record<string, any> | null;
  dealValue: number;
  email: string | null;
  id: string;
  isArchived: boolean;
  lastActivityAt: string | null;
  lifecycleStage: LifecycleStage | null;
  lifecycleStageId: string | null;
  name: string;
  notes: string | null;
  owner: CrmMember | null;
  ownerId: string | null;
  phone: string | null;
  score: number | null;
  source: ContactSource;
  tags: Tag[];
  updatedAt: string;
}
