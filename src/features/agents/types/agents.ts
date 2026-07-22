export type SystemAgentStatus = 'active' | 'coming_soon';

export interface SystemAgentCatalogItem {
  id: string;
  slug: string;
  name: string;
  role: string;
  description: string;
  status: SystemAgentStatus;
  model: string;
  createdAt: string;
}

export type WorkflowRunStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface WorkflowRunStep {
  step: string;
  status?: string;
  output?: unknown;
  error?: { message: string; name: string };
  [key: string]: unknown;
}

export interface WorkflowRun {
  id: string;
  businessId: string;
  goal: string;
  status: WorkflowRunStatus;
  steps: WorkflowRunStep[];
  errorMessage: string | null;
  startedAt: string | null;
  finishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
