import api from '@shared/api/axios';
import { ApiResponse, unwrap } from '@core/types/api';
import { SystemAgentCatalogItem, WorkflowRun } from '../types/agents';

export const agentsApi = {
  getCatalog: (): Promise<SystemAgentCatalogItem[]> =>
    api
      .get<unknown, ApiResponse<SystemAgentCatalogItem[]>>('/agents-catalog')
      .then(unwrap),

  triggerRun: (businessId: string, goal: string): Promise<WorkflowRun> =>
    api
      .post<unknown, ApiResponse<WorkflowRun>>(
        `/businesses/${businessId}/orchestrator/runs`,
        { goal },
      )
      .then(unwrap),

  getRun: (businessId: string, runId: string): Promise<WorkflowRun> =>
    api
      .get<unknown, ApiResponse<WorkflowRun>>(
        `/businesses/${businessId}/orchestrator/runs/${runId}`,
      )
      .then(unwrap),
};
