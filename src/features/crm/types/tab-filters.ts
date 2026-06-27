import { ContactSource } from '@crm/types/crm';

export interface TabFilters {
  search: string;
  source: ContactSource | '';
  ownerId: string;
  lifecycleStageId: string;
  createdAtFrom: string;
  createdAtTo: string;
  lastActivityAtFrom: string;
  lastActivityAtTo: string;
  page: number;
}
