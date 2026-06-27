import { SegmentCondition } from "./segment-condition";

export interface UpdateSegmentInput {
  conditions?: SegmentCondition[];
  description?: string;
  name?: string;
}
