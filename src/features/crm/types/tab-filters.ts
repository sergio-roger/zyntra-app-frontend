import { ContactSource } from "@crm/types/crm";
import { SegmentCondition } from "@crm/types/segment-condition";

export interface TabFilters {
  search: string;
  source: ContactSource | "";
  ownerId: string;
  lifecycleStageId: string;
  createdAtFrom: string;
  createdAtTo: string;
  lastActivityAtFrom: string;
  lastActivityAtTo: string;
  customFieldConditions: SegmentCondition[];
  page: number;
}
