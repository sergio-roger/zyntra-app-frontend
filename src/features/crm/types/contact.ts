import { LifecycleStage } from './lifecycle-stage';
import { CrmMember } from './crm-member';
import { Tag } from './tag';

export interface ContactCompany {
  id: string;
  name: string;
}

export interface Contact {
  businessId: string;
  channel: { id: string; name: string } | null;
  channelId: string | null;
  company: ContactCompany | null;
  companyId: string | null;
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
  tags: Tag[];
  updatedAt: string;
}

