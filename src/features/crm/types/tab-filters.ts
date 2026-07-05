import { SegmentCondition } from '@crm/types/segment-condition';

export interface TabFilters {
  channelId: string;
  createdAtFrom: string;
  createdAtTo: string;
  customFieldConditions: SegmentCondition[];
  lastActivityAtFrom: string;
  lastActivityAtTo: string;
  lifecycleStageId: string;
  ownerId: string;
  page: number;
  search: string;
}
