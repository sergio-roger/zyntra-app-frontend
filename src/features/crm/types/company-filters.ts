import { SegmentCondition } from './segment-condition';

export interface CompanyListFilters {
  createdAtFrom: string;
  createdAtTo: string;
  customFieldConditions: SegmentCondition[];
  industryId: string;
  lifecycleStageId: string;
  ownerId: string;
  page: number;
  search: string;
}
