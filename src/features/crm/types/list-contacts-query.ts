import { ContactSource } from '@crm/types/crm';

export interface ListContactsQuery {
  isArchived?: boolean;
  lifecycleStageId?: string;
  limit?: number;
  ownerId?: string;
  page?: number;
  search?: string;
  source?: ContactSource;
  tag?: string;
}
