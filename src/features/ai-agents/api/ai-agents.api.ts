import api from '@shared/api/axios';
import type {
  AiAgent,
  AgentTestResult,
  CreateAgentPayload,
  UpdateAgentPayload,
} from '../types/ai-agents.types';

const unwrap = <T>(res: unknown): T => {
  if (res && typeof res === 'object' && 'data' in (res as object)) {
    return (res as { data: T }).data;
  }
  return res as T;
};

export const aiAgentsApi = {
  list: (businessId: string): Promise<AiAgent[]> =>
    api.get(`/businesses/${businessId}/agents`).then(unwrap),

  get: (businessId: string, agentId: string): Promise<AiAgent> =>
    api.get(`/businesses/${businessId}/agents/${agentId}`).then(unwrap),

  create: (businessId: string, payload: CreateAgentPayload): Promise<AiAgent> =>
    api.post(`/businesses/${businessId}/agents`, payload).then(unwrap),

  update: (businessId: string, agentId: string, payload: UpdateAgentPayload): Promise<AiAgent> =>
    api.patch(`/businesses/${businessId}/agents/${agentId}`, payload).then(unwrap),

  remove: (businessId: string, agentId: string): Promise<{ success: boolean }> =>
    api.delete(`/businesses/${businessId}/agents/${agentId}`).then(unwrap),

  test: (businessId: string, agentId: string, message: string): Promise<AgentTestResult> =>
    api.post(`/businesses/${businessId}/agents/${agentId}/test`, { message }).then(unwrap),
};
