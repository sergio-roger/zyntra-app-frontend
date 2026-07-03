import { SegmentCondition } from './segment-condition';

export interface CreateSegmentInput {
  conditions: SegmentCondition[];
  description?: string;
  name: string;
  type?: 'dynamic' | 'static';
}
