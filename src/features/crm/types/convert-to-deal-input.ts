export interface ConvertToDealInput {
  description?: string;
  expected_close_date?: string;
  pipeline_id: string;
  stage_id: string;
  title: string;
  value?: number;
}
