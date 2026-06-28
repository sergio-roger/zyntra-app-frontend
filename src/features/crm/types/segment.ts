import { SegmentCondition } from './segment-condition';

export interface Segment {
  businessId: string;
  conditions: SegmentCondition[];
  createdAt: string;
  description: string | null;
  id: string;
  name: string;
  updatedAt: string;
}
