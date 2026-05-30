export enum AgentTaskStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum AgentTaskType {
  CONTENT = 'content',
  SOCIAL = 'social',
  CHATBOT = 'chatbot',
  CRM_ANALYSIS = 'crm_analysis',
  REPORT = 'report',
}

export interface AgentTask {
  _id: string;
  business_id: string;
  type: AgentTaskType;
  status: AgentTaskStatus;
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  error?: string;
  createdAt: string;
  updatedAt: string;
  completed_at?: string;
  duration_ms?: number;
}

export interface CreateTaskDto {
  type: AgentTaskType;
  input: Record<string, unknown>;
}
