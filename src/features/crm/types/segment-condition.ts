export interface SegmentCondition {
  field: string;
  operator:
    | 'equals'
    | 'not_equals'
    | 'contains'
    | 'greater_than'
    | 'less_than'
    | 'in'
    | 'is_empty'
    | 'is_not_empty';
  value: any;
}
