import api from '@shared/api/axios';
import { ApiResponse, unwrap } from '@core/types/api';
import {
  ImportedSystemAgent,
  SystemAgentCatalogItem,
  WorkflowRun,
} from '@features/marketing/types/agents';

interface BusinessSystemAgentResponse {
  importedAt: string;
  systemAgent: SystemAgentCatalogItem;
}

const toImportedAgent = (
  row: BusinessSystemAgentResponse,
): ImportedSystemAgent => ({
  ...row.systemAgent,
  importedAt: row.importedAt,
});

export const agentsApi = {
  getCatalog: (): Promise<SystemAgentCatalogItem[]> =>
    api
      .get<unknown, ApiResponse<SystemAgentCatalogItem[]>>('/agents-catalog')
      .then(unwrap),

  getImportedAgents: (businessId: string): Promise<ImportedSystemAgent[]> =>
    api
      .get<unknown, ApiResponse<BusinessSystemAgentResponse[]>>(
        `/businesses/${businessId}/system-agents`,
      )
      .then(unwrap)
      .then((rows) => rows.map(toImportedAgent)),

  importAgent: (
    businessId: string,
    systemAgentId: string,
  ): Promise<ImportedSystemAgent> =>
    api
      .post<unknown, ApiResponse<BusinessSystemAgentResponse>>(
        `/businesses/${businessId}/system-agents/${systemAgentId}/import`,
      )
      .then(unwrap)
      .then(toImportedAgent),

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
