import { SegmentCondition } from "./segment-condition";

export interface Segment {
  business_id: string;
  conditions: SegmentCondition[];
  created_at: string;
  description: string | null;
  id: string;
  name: string;
  updated_at: string;
}
